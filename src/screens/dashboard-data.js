import { CANCELLED, NO_SHOW, RESERVED_EXTRA, WAITING } from '../data/ops'
import { TODAY, roomsFor } from '../data/core'

export function collapseArrivals(bookings, date = TODAY) {
  const live = bookings.filter(
    (booking) => booking.start === date && !['cancelled', 'no-show', 'checked-out'].includes(booking.status),
  )
  const rows = []
  const seen = new Set()
  for (const booking of live) {
    if (!booking.groupId) {
      rows.push({
        id: booking.id,
        bookingId: booking.id,
        name: booking.guestName,
        guests: booking.guests,
        source: booking.source,
        start: booking.start,
        end: booking.end,
        amount: booking.amount,
        currency: booking.currency,
        beds: [booking.bed],
        status: booking.status,
      })
      continue
    }
    if (seen.has(booking.groupId)) continue
    seen.add(booking.groupId)
    const members = live.filter((item) => item.groupId === booking.groupId)
    rows.push({
      id: `group-${booking.groupId}`,
      bookingId: booking.id,
      name: booking.groupName,
      guests: members.length,
      source: booking.source,
      start: booking.start,
      end: booking.end,
      amount: members.reduce((sum, item) => sum + item.amount, 0),
      currency: booking.currency,
      beds: members.map((item) => item.bed),
      status: booking.status,
    })
  }
  return rows
}

export function buildDashboard(hostelBookings, hostelId, empty, date = TODAY) {
  const arrivals = empty ? [] : collapseArrivals(hostelBookings, date)
  const departures = empty ? [] : hostelBookings.filter((booking) => booking.end === date)
  const reserved = [
    ...hostelBookings.filter((booking) => booking.status === 'reserved' && booking.start > date),
    ...(RESERVED_EXTRA[hostelId] ?? []),
  ]
  const waiting = WAITING[hostelId] ?? []
  const noshow = NO_SHOW[hostelId] ?? []
  const cancelled = CANCELLED[hostelId] ?? []

  const toRow = (item) => ({
    id: item.id,
    bookingId: item.bookingId,
    name: item.name ?? item.guestName,
    guests: item.guests ?? 1,
    source: item.source,
    start: item.start,
    end: item.end,
    amount: item.amount,
    currency: item.currency,
    beds: item.beds ?? (item.bed ? [item.bed] : []),
    status: item.status ?? 'reserved',
    need: item.need,
  })

  return {
    rows: {
      arrivals,
      departures: departures.map(toRow),
      reserved: reserved.map(toRow),
      waiting: waiting.map(toRow),
      noshow: noshow.map(toRow),
      cancelled: cancelled.map(toRow),
    },
    counters: [
      { id: 'arrivals', label: 'Arrivals', count: arrivals.length },
      { id: 'departures', label: 'Departures', count: departures.length },
      { id: 'waiting', label: 'Waiting list', count: waiting.length },
      { id: 'reserved', label: 'Reserved', count: reserved.length },
      { id: 'noshow', label: 'No show', count: noshow.length },
      { id: 'cancelled', label: 'Cancelled', count: cancelled.length },
    ],
  }
}

export function bedStats(hostelBookings, hostelHolds, hostelId, date = TODAY) {
  const beds = roomsFor(hostelId).flatMap((room) => room.beds.map((letter) => `${room.id}-${letter}`))
  const occupied = beds.filter((bed) =>
    hostelBookings.some((booking) => booking.bed === bed && booking.start <= date && booking.end > date),
  ).length
  const holdsToday = hostelHolds.filter((hold) => hold.start <= date && hold.end > date).length
  return {
    beds,
    occupied,
    holdsToday,
    freeBeds: beds.length - occupied,
    pct: Math.round((occupied / beds.length) * 100),
  }
}

export function freeByRoom(hostelBookings, hostelId, date = TODAY) {
  return roomsFor(hostelId).map((room) => {
    const roomBeds = room.beds.map((letter) => `${room.id}-${letter}`)
    const free = roomBeds.filter(
      (bed) =>
        !hostelBookings.some(
          (booking) => booking.bed === bed && booking.start <= date && booking.end > date,
        ),
    ).length
    return { ...room, free }
  })
}
