export const TODAY = '2026-09-17'

export const HOSTELS = [
  {
    id: 'addis',
    name: 'Mad Vervet Addis Ababa',
    short: 'Addis Ababa',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    currency: 'ETB',
    timezone: 'EAT',
    address: 'Bole Medhanealem, Addis Ababa',
    beds: 32,
  },
  {
    id: 'nairobi',
    name: 'Mad Vervet Nairobi',
    short: 'Nairobi',
    city: 'Nairobi',
    country: 'Kenya',
    currency: 'KES',
    timezone: 'EAT',
    address: 'Kilimani, Nairobi',
    beds: 20,
  },
]

// Rooms are named, per property. A bed id is always `<roomId>-<letter>`.
export const ROOMS = {
  addis: [
    { id: 'hawassa', type: 'dorm8', typeName: '8-Bed Mixed Dorm', name: 'Hawassa', beds: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], capacity: 8 },
    { id: 'lalibela', type: 'dorm8', typeName: '8-Bed Mixed Dorm En-suite', name: 'Lalibela', beds: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'], capacity: 8 },
    { id: 'female6', type: 'dorm6', typeName: '6-Bed Female Dorm', name: 'Female Dorm', beds: ['A', 'B', 'C', 'D', 'E', 'F'], capacity: 6 },
    { id: 'denakil', type: 'single', typeName: 'Single Room', name: 'Denakil', beds: ['A'], capacity: 1 },
    { id: 'gondar', type: 'single', typeName: 'Single Room', name: 'Gondar', beds: ['A'], capacity: 1 },
    { id: 'bahirdar', type: 'double', typeName: 'Double Room', name: 'BahirDar', beds: ['A'], capacity: 2 },
    { id: 'omo', type: 'double', typeName: 'Double Room', name: 'Omo', beds: ['A'], capacity: 2 },
    { id: 'bale', type: 'double', typeName: 'Double Room', name: 'Bale', beds: ['A'], capacity: 2 },
    { id: 'axum', type: 'double', typeName: 'Double Room', name: 'Axum', beds: ['A'], capacity: 2 },
  ],
  nairobi: [
    { id: 'masaimara', type: 'dorm4', typeName: '4-Bed Mixed Dorm', name: 'Masai Mara', beds: ['A', 'B', 'C', 'D'], capacity: 4 },
    { id: 'kisumu', type: 'dorm4', typeName: '4-Bed Mixed Dorm', name: 'Kisumu', beds: ['A', 'B', 'C', 'D'], capacity: 4 },
    { id: 'turkana', type: 'dorm4', typeName: '4-Bed Mixed Dorm Deluxe', name: 'Turkana', beds: ['A', 'B', 'C', 'D'], capacity: 4 },
    { id: 'naivasha', type: 'dorm4f', typeName: '4-Bed Female Dorm', name: 'Naivasha', beds: ['A', 'B', 'C', 'D'], capacity: 4 },
    { id: 'nakuru', type: 'double', typeName: 'Double Private Room', name: 'Nakuru', beds: ['A'], capacity: 2 },
    { id: 'amboseli', type: 'double', typeName: 'Double Private Room', name: 'Amboseli', beds: ['A'], capacity: 2 },
  ],
}

export const ALL_ROOMS = [...ROOMS.addis, ...ROOMS.nairobi]

export function roomsFor(hostelId) {
  return ROOMS[hostelId] ?? ROOMS.addis
}

export function roomById(id) {
  return ALL_ROOMS.find((room) => room.id === id) ?? ALL_ROOMS[0]
}
// Room rates are quoted in USD. A number for per-bed rooms; { pax1, pax2 } for double rooms.
export const RATE_CURRENCY = 'USD'

export const RATES = {
  addis: {
    hawassa: 12,
    lalibela: 15,
    female6: 14,
    denakil: 25,
    gondar: 25,
    bahirdar: { pax1: 24, pax2: 30 },
    omo: { pax1: 24, pax2: 30 },
    bale: { pax1: 24, pax2: 30 },
    axum: { pax1: 24, pax2: 30 },
  },
  nairobi: {
    masaimara: 18,
    kisumu: 18,
    turkana: 22,
    naivasha: 20,
    nakuru: { pax1: 45, pax2: 55 },
    amboseli: { pax1: 45, pax2: 55 },
  },
}

export function isDoubleRoom(roomId) {
  return roomById(roomId).type === 'double'
}

export function rateFor(hostelId, roomId) {
  const rate = RATES[hostelId]?.[roomId] ?? 0
  return typeof rate === 'object' ? rate.pax1 : rate
}

export function paxRatesFor(hostelId, roomId) {
  const rate = RATES[hostelId]?.[roomId] ?? 0
  if (typeof rate === 'object') return rate
  return { pax1: rate, pax2: rate }
}

export function roomLabel(room) {
  return `${room.typeName} (${room.name})`
}

export const CURRENCIES = [
  { code: 'ETB', label: 'ETB · Ethiopian birr' },
  { code: 'USD', label: 'USD · US dollar' },
  { code: 'KES', label: 'KES · Kenyan shilling' },
  { code: 'EUR', label: 'EUR · Euro' },
]

// Foreign currencies that can be recorded into an FCY (foreign-currency) account.
export const FCY_CURRENCIES = ['USD', 'EUR', 'GBP', 'CHF', 'AUD', 'CAD']

// Approximate FX to USD, used to denominate reports in USD.
export const FX_TO_USD = {
  ETB: 1 / 120,
  KES: 1 / 129,
  USD: 1,
  FCY: 1,
  EUR: 1.08,
  GBP: 1.27,
  CHF: 1.12,
  AUD: 0.66,
  CAD: 0.74,
}

export function toUsd(amount, currency) {
  return Math.round(amount * (FX_TO_USD[currency] ?? 1))
}

export function isForeignCurrency(currency) {
  return currency !== 'ETB' && currency !== 'KES'
}

export const PAYMENT_METHODS = ['Cash', 'Card', 'M-Pesa']

export const ACCOUNTS = [
  { id: 'addis-cash', hostelId: 'addis', name: 'Front Desk Cash', kind: 'Cash', currency: 'ETB', balance: 84250, reconciled: 'Today 09:10' },
  { id: 'addis-cash-usd', hostelId: 'addis', name: 'Front Desk Cash', kind: 'Cash', currency: 'FCY', balance: 1240, reconciled: 'Today 09:10' },
  { id: 'addis-bank', hostelId: 'addis', name: 'Bank', kind: 'Bank', currency: 'ETB', balance: 152400, reconciled: 'Yesterday 18:40' },
  { id: 'addis-bank-usd', hostelId: 'addis', name: 'Bank (Stripe+Wise)', kind: 'Bank', currency: 'FCY', balance: 3400, reconciled: '14 Sep 16:20' },
  { id: 'addis-saving', hostelId: 'addis', name: 'Saving', kind: 'Saving', currency: 'ETB', balance: 210000, reconciled: '12 Sep 11:05' },
  { id: 'addis-saving-usd', hostelId: 'addis', name: 'Saving', kind: 'Saving', currency: 'FCY', balance: 8600, reconciled: '11 Sep 15:40' },
  { id: 'nairobi-cash', hostelId: 'nairobi', name: 'Front Desk Cash', kind: 'Cash', currency: 'KES', balance: 96500, reconciled: 'Today 09:05' },
  { id: 'nairobi-cash-usd', hostelId: 'nairobi', name: 'Front Desk Cash', kind: 'Cash', currency: 'FCY', balance: 860, reconciled: 'Today 09:05' },
  { id: 'nairobi-bank', hostelId: 'nairobi', name: 'Bank', kind: 'Bank', currency: 'KES', balance: 214800, reconciled: 'Yesterday 18:10' },
  { id: 'nairobi-bank-usd', hostelId: 'nairobi', name: 'Bank (Stripe+Wise)', kind: 'Bank', currency: 'FCY', balance: 2140, reconciled: '13 Sep 15:30' },
  { id: 'nairobi-saving', hostelId: 'nairobi', name: 'Saving', kind: 'Saving', currency: 'KES', balance: 180000, reconciled: '12 Sep 10:20' },
  { id: 'nairobi-saving-usd', hostelId: 'nairobi', name: 'Saving', kind: 'Saving', currency: 'FCY', balance: 5400, reconciled: '11 Sep 14:10' },
]

export const SOURCES = {
  direct: { id: 'direct', label: 'Direct website', dot: 'bg-source-direct', short: 'D.' },
  walkin: { id: 'walkin', label: 'Walk-in', dot: 'bg-source-walkin', short: 'W.' },
  phone: { id: 'phone', label: 'Phone', dot: 'bg-source-phone', short: 'P.' },
  whatsapp: { id: 'whatsapp', label: 'WhatsApp', dot: 'bg-source-whatsapp', short: 'WA' },
  booking: { id: 'booking', label: 'Booking.com', dot: 'bg-source-booking', short: 'B.' },
  hostelworld: { id: 'hostelworld', label: 'Hostelworld', dot: 'bg-source-hostelworld', short: 'HW' },
  expedia: { id: 'expedia', label: 'Expedia', dot: 'bg-source-expedia', short: 'Ex' },
}

export const SOURCE_ORDER = ['direct', 'walkin', 'phone', 'whatsapp', 'booking', 'hostelworld', 'expedia']
export const STATUSES = [
  { id: 'reserved', label: 'Reserved' },
  { id: 'checked-in', label: 'Checked in' },
  { id: 'checked-out', label: 'Checked out' },
  { id: 'no-show', label: 'No show' },
  { id: 'cancelled', label: 'Cancelled' },
]

export const STATUS_STYLE = {
  reserved: { pill: 'bg-status-reserved text-ink', dot: 'bg-status-reserved', label: 'Reserved' },
  'checked-in': { pill: 'bg-status-checkedin text-ink', dot: 'bg-status-checkedin', label: 'Checked in' },
  'checked-out': { pill: 'bg-status-checkedout text-ink', dot: 'bg-status-checkedout', label: 'Checked out' },
  'no-show': { pill: 'bg-status-cancelled text-ink', dot: 'bg-status-cancelled', label: 'No show' },
  cancelled: { pill: 'bg-status-cancelled text-ink', dot: 'bg-status-cancelled', label: 'Cancelled' },
  unpaid: { pill: 'bg-status-unpaid text-ink', dot: 'bg-status-unpaid', label: 'Unpaid balance' },
}

// Resolves the calendar pill colour: green = checked in, blue = reserved,
// orange = unpaid balance, grey = cancelled / no-show / checked out.
export function pillTone(booking) {
  if (booking.status === 'cancelled' || booking.status === 'no-show') return 'cancelled'
  if (booking.balance > 0) return 'unpaid'
  return booking.status
}

export const USERS = {
  staff: {
    id: 'u-sara',
    name: 'Sara Bekele',
    role: 'staff',
    hostelId: 'addis',
    email: 'staff@madvervet.com',
    initials: 'SB',
    title: 'Front desk',
  },
  admin: {
    id: 'u-almaz',
    name: 'Almaz Tesfaye',
    role: 'admin',
    hostelId: 'addis',
    email: 'admin@madvervet.com',
    initials: 'AT',
    title: 'Owner',
  },
}

// Staff accounts managed from Settings. Admins and staff can sign in.
export const INITIAL_STAFF = [
  { id: 'u-sara', name: 'Sara Bekele', email: 'staff@madvervet.com', role: 'staff', hostelId: 'addis', title: 'Front desk', initials: 'SB' },
  { id: 'u-almaz', name: 'Almaz Tesfaye', email: 'admin@madvervet.com', role: 'admin', hostelId: 'addis', title: 'Owner', initials: 'AT' },
  { id: 'u-hanna', name: 'Hanna Girma', email: 'hanna@madvervet.com', role: 'staff', hostelId: 'addis', title: 'Front desk', initials: 'HG' },
  { id: 'u-daniel', name: 'Daniel Mwangi', email: 'daniel@madvervet.com', role: 'staff', hostelId: 'nairobi', title: 'Front desk', initials: 'DM' },
]

// Feature flags managed from Settings.
export const INITIAL_FEATURES = {
  emailParsing: true,
  otaParsing: false, // stays off — no OTA parsing yet
}

export const DEMO_ACCOUNTS = [
  { role: 'staff', email: 'staff@madvervet.com', password: 'reception', label: 'Staff · Addis Ababa' },
  { role: 'admin', email: 'admin@madvervet.com', password: 'admin', label: 'Admin · both hostels' },
]

export function hostelById(id) {
  return HOSTELS.find((h) => h.id === id) ?? HOSTELS[0]
}

export function bedParts(bed) {
  const [roomId, letter] = bed.split('-')
  return { roomId, letter }
}

// Beds are shown by number: A → 1, B → 2, etc.
export function bedNumber(bed) {
  const { letter } = bedParts(bed)
  return letter.charCodeAt(0) - 64
}

export function bedLabel(bed) {
  return `Bed ${bedNumber(bed)}`
}

export function bedRoom(bed) {
  return roomById(bedParts(bed).roomId)
}

export function accountsFor(hostelId, currency) {
  return ACCOUNTS.filter(
    (a) => a.hostelId === hostelId && (!currency || a.currency === currency),
  )
}


