import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ACCOUNTS, HOSTELS, INITIAL_FEATURES, INITIAL_STAFF, TODAY, USERS, hostelById } from '../data/core'
import { GUESTS, HOLDS, INITIAL_BOOKINGS } from '../data/bookings'
import { INITIAL_LEDGER, INITIAL_STAFF_ENTRIES, INITIAL_TRANSFERS } from '../data/finance'

const AppContext = createContext(null)

function demoRole() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const demo = params.get('demo')
  return demo === 'staff' || demo === 'admin' ? demo : null
}

function bootHostel(fallback) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
  const id = params.get('hostel')
  return id === 'addis' || id === 'nairobi' ? id : fallback
}

export function AppProvider({ children }) {
  const bootRole = demoRole()
  const bootUser = bootRole ? USERS[bootRole] : null
  const bootHostelId = bootHostel(bootUser?.hostelId ?? 'addis')
  const [user, setUser] = useState(bootUser)
  const [hostelId, setHostelId] = useState(bootHostelId)
  const [currency, setCurrency] = useState(hostelById(bootHostelId).currency)
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS)
  const [holds] = useState(HOLDS)
  const [accounts, setAccounts] = useState(ACCOUNTS)
  const [ledger, setLedger] = useState(INITIAL_LEDGER)
  const [transfers, setTransfers] = useState(INITIAL_TRANSFERS)
  const [staffEntries, setStaffEntries] = useState(INITIAL_STAFF_ENTRIES)
  const [guestNotes, setGuestNotes] = useState(() =>
    Object.fromEntries(GUESTS.map((guest) => [guest.id, guest.notes])),
  )
  const [toast, setToast] = useState(null)
  const [staff, setStaff] = useState(INITIAL_STAFF)
  const [features, setFeatures] = useState(INITIAL_FEATURES)
  const timer = useRef(null)

  const notify = useCallback((next) => {
    setToast({ id: Date.now(), tone: 'success', ...next })
  }, [])

  useEffect(() => {
    if (!toast) return undefined
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), toast.duration ?? 4200)
    return () => clearTimeout(timer.current)
  }, [toast])

  const signIn = useCallback((role) => {
    const nextUser = USERS[role] ?? USERS.staff
    setUser(nextUser)
    setHostelId(nextUser.hostelId)
    setCurrency(hostelById(nextUser.hostelId).currency)
    return nextUser
  }, [])

  const signOut = useCallback(() => {
    setUser(null)
    setToast(null)
  }, [])

  const switchHostel = useCallback((nextId) => {
    setHostelId(nextId)
    setCurrency(hostelById(nextId).currency)
  }, [])

  const moveBooking = useCallback((bookingId, bed, start) => {
    setBookings((rows) =>
      rows.map((booking) => {
        if (booking.id !== bookingId) return booking
        const nights = Math.max(
          1,
          Math.round((new Date(booking.end) - new Date(booking.start)) / 86400000),
        )
        const endDate = new Date(start)
        endDate.setDate(endDate.getDate() + nights)
        const end = endDate.toISOString().slice(0, 10)
        return { ...booking, bed, start, end }
      }),
    )
  }, [])

  const updateBooking = useCallback((bookingId, patch) => {
    setBookings((rows) => rows.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)))
  }, [])

  const addBooking = useCallback((booking) => {
    setBookings((rows) => [booking, ...rows])
  }, [])

  const addLedgerEntry = useCallback((entry) => {
    setLedger((rows) => [entry, ...rows])
  }, [])

  const addStaffEntry = useCallback((entry) => {
    setStaffEntries((rows) => [entry, ...rows])
  }, [])

  const updateGuestNote = useCallback((guestId, notes) => {
    setGuestNotes((current) => ({ ...current, [guestId]: notes }))
  }, [])

  const addTransfer = useCallback(
    (transfer) => {
      setTransfers((rows) => [transfer, ...rows])
      setAccounts((rows) =>
        rows.map((account) => {
          if (account.id === transfer.fromId) {
            return { ...account, balance: account.balance - transfer.amount }
          }
          if (account.id === transfer.toId) {
            return { ...account, balance: account.balance + transfer.toAmount }
          }
          return account
        }),
      )
    },
    [],
  )

  const addStaff = useCallback((account) => {
    setStaff((rows) => [...rows, account])
  }, [])

  const removeStaff = useCallback((id) => {
    setStaff((rows) => rows.filter((account) => account.id !== id))
  }, [])

  const setFeature = useCallback((key, value) => {
    setFeatures((current) => ({ ...current, [key]: value }))
  }, [])

  const hostel = useMemo(() => hostelById(hostelId), [hostelId])
  const hostelAccounts = useMemo(
    () => accounts.filter((account) => account.hostelId === hostelId),
    [accounts, hostelId],
  )
  const hostelLedger = useMemo(
    () => ledger.filter((entry) => entry.hostelId === hostelId),
    [ledger, hostelId],
  )
  const hostelTransfers = useMemo(
    () => transfers.filter((transfer) => transfer.hostelId === hostelId),
    [transfers, hostelId],
  )
  const hostelBookings = useMemo(
    () => bookings.filter((booking) => booking.hostelId === hostelId),
    [bookings, hostelId],
  )
  const hostelHolds = useMemo(
    () => holds.filter((hold) => hold.hostelId === hostelId),
    [holds, hostelId],
  )
  const hostelGuests = useMemo(() => {
    const folios = new Set(
      bookings.filter((booking) => booking.hostelId === hostelId).map((booking) => booking.id),
    )
    return GUESTS.filter((guest) => folios.has(guest.folio))
  }, [bookings, hostelId])
  const todayEntries = useMemo(
    () => staffEntries.filter((entry) => entry.by === user?.name && entry.date === TODAY),
    [staffEntries, user],
  )

  const value = {
    user,
    hostel,
    hostelId,
    hostels: HOSTELS,
    currency,
    setCurrency,
    signIn,
    signOut,
    switchHostel,
    isAdmin: user?.role === 'admin',
    bookings,
    hostelBookings,
    holds,
    hostelHolds,
    guests: hostelGuests,
    accounts,
    hostelAccounts,
    ledger,
    hostelLedger,
    transfers,
    hostelTransfers,
    staffEntries,
    todayEntries,
    staffToday: TODAY,
    guestNotes,
    updateGuestNote,
    moveBooking,
    updateBooking,
    addBooking,
    addLedgerEntry,
    addStaffEntry,
    addTransfer,
    staff,
    features,
    addStaff,
    removeStaff,
    setFeature,
    toast,
    notify,
    dismissToast: () => setToast(null),
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}
