export const WAITING = {
  addis: [
    { id: 'w1', name: 'Yonas Tadesse', guests: 2, source: 'walkin', since: '11:20', need: '2 beds · mixed dorm', note: 'Waiting for the 14:00 check-out.' },
    { id: 'w2', name: 'Miriam Bekele', guests: 1, source: 'phone', since: '12:05', need: '1 bed · female dorm', note: 'Will take a double if nothing frees up.' },
  ],
  nairobi: [
    { id: 'w3', name: 'Kevin Mwaura', guests: 1, source: 'walkin', since: '10:40', need: '1 bed · mixed dorm', note: 'Leaves at 18:00 if no bed.' },
  ],
}

export const RESERVED_EXTRA = {
  addis: [
    { id: 'r1', name: 'Hanna Tesfaye', source: 'direct', start: '2026-09-24', end: '2026-09-27', amount: 4200, currency: 'ETB', bed: 'female6-C', status: 'reserved' },
    { id: 'r2', name: 'Ruth Achieng', source: 'whatsapp', start: '2026-09-20', end: '2026-09-22', amount: 2400, currency: 'ETB', bed: 'hawassa-B', status: 'reserved' },
  ],
  nairobi: [
    { id: 'r3', name: 'Mercy Wairimu', source: 'direct', start: '2026-09-22', end: '2026-09-25', amount: 7800, currency: 'KES', bed: 'naivasha-C', status: 'reserved' },
  ],
}

export const NO_SHOW = {
  addis: [
    { id: 'n1', name: 'Marco Bianchi', source: 'phone', start: '2026-09-15', end: '2026-09-18', amount: 4200, currency: 'ETB', bed: 'hawassa-C', status: 'no-show' },
  ],
  nairobi: [],
}

export const CANCELLED = {
  addis: [
    { id: 'c1', name: 'Liam Doyle', source: 'phone', start: '2026-09-16', end: '2026-09-19', amount: 3600, currency: 'ETB', bed: 'hawassa-E', status: 'cancelled' },
    { id: 'c2', name: 'Ana Petrova', source: 'whatsapp', start: '2026-09-14', end: '2026-09-17', amount: 4200, currency: 'ETB', bed: 'female6-C', status: 'cancelled' },
  ],
  nairobi: [
    { id: 'c3', name: 'Peter Nyaga', source: 'direct', start: '2026-09-19', end: '2026-09-21', amount: 4400, currency: 'KES', bed: 'kisumu-D', status: 'cancelled' },
  ],
}

export const AUDIT = [
  { id: 'a1', at: '17 Sep 2026 · 09:42', actor: 'Sara Bekele', action: 'Booking created', entity: 'BK-2419 · Mei Tanaka', detail: 'WhatsApp enquiry, Bed C, 17–21 Sep', source: 'whatsapp' },
  { id: 'a2', at: '17 Sep 2026 · 09:12', actor: 'Sara Bekele', action: 'Payment recorded', entity: 'BK-2420 · Sofia Rossi', detail: 'ETB 2,400 deposit by M-Pesa', source: 'direct' },
  { id: 'a3', at: '17 Sep 2026 · 08:58', actor: 'Sara Bekele', action: 'Booking created', entity: 'BK-2425 · Fatima Al-Sayed', detail: 'Phone booking, female dorm, 2 nights', source: 'phone' },
  { id: 'a4', at: '16 Sep 2026 · 18:52', actor: 'Daniel Mwangi', action: 'Check-in', entity: 'BK-3610 · David Ochieng', detail: 'Nakuru A, 2 guests, card payment', source: 'walkin' },
  { id: 'a5', at: '16 Sep 2026 · 17:31', actor: 'Sara Bekele', action: 'Bed moved', entity: 'BK-2428 · Yuki Sato', detail: 'Bed E → Bed F, same room type', source: 'whatsapp' },
  { id: 'a6', at: '16 Sep 2026 · 15:04', actor: 'Almaz Tesfaye', action: 'Maintenance hold', entity: 'bale-A · 18–21 Sep', detail: 'Broken window latch, bed closed', source: 'direct' },
  { id: 'a7', at: '16 Sep 2026 · 11:20', actor: 'Sara Bekele', action: 'Booking cancelled', entity: 'BK-2416 · Liam Doyle', detail: 'Guest cancelled, no charge', source: 'phone' },
  { id: 'a8', at: '15 Sep 2026 · 16:44', actor: 'Almaz Tesfaye', action: 'Transfer created', entity: 'TR-51 · USD cash → Bank (Stripe+Wise)', detail: 'USD 400 banked', source: 'direct' },
  { id: 'a9', at: '15 Sep 2026 · 09:30', actor: 'Sara Bekele', action: 'Check-in', entity: 'BK-2417 · Amara Okafor', detail: 'Bed A, card payment, ETB 4,800', source: 'phone' },
  { id: 'a10', at: '14 Sep 2026 · 20:12', actor: 'Sara Bekele', action: 'No-show marked', entity: 'BK-2414 · Marco Bianchi', detail: 'Bed C released at 20:00', source: 'phone' },
  { id: 'a11', at: '17 Sep 2026 · 10:04', actor: 'Sara Bekele', action: 'Income recorded', entity: 'TXN-1005 · Laundry', detail: 'Guest laundry, ETB 600 by M-Pesa', source: 'walkin' },
  { id: 'a12', at: '16 Sep 2026 · 09:40', actor: 'Daniel Mwangi', action: 'Expense recorded', entity: 'TXN-2003 · Supplies', detail: 'Linen replacement, KES 7,800', source: 'direct' },
]
export const REPORT = {
  addis: {
    kpis: [
      { label: 'Occupancy', value: '81%', detail: '26 of 32 beds · 1–17 Sep' },
      { label: 'ADR', value: 1412, currency: 'ETB', detail: 'Average daily rate · in USD' },
      { label: 'RevPAR', value: 1144, currency: 'ETB', detail: 'Revenue per available bed · in USD' },
      { label: 'Nights sold', value: '264', detail: '14 cancellations excluded' },
    ],
    sources: [
      { id: 'booking', label: 'Booking.com', count: 42 },
      { id: 'hostelworld', label: 'Hostelworld', count: 24 },
      { id: 'expedia', label: 'Expedia', count: 14 },
      { id: 'direct', label: 'Direct website', count: 58 },
      { id: 'phone', label: 'Phone', count: 32 },
      { id: 'walkin', label: 'Walk-in', count: 21 },
      { id: 'whatsapp', label: 'WhatsApp', count: 17 },
    ],
    revenue: [
      { label: '8-Bed Mixed Dorm', value: 172800, currency: 'ETB' },
      { label: '6-Bed Female Dorm', value: 58200, currency: 'ETB' },
      { label: 'Single Rooms', value: 38800, currency: 'ETB' },
      { label: 'Double Rooms', value: 62400, currency: 'ETB' },
    ],
  },
  nairobi: {
    kpis: [
      { label: 'Occupancy', value: '62%', detail: '12 of 20 beds · 1–17 Sep' },
      { label: 'ADR', value: 2580, currency: 'KES', detail: 'Average daily rate · in USD' },
      { label: 'RevPAR', value: 1600, currency: 'KES', detail: 'Revenue per available bed · in USD' },
      { label: 'Nights sold', value: '118', detail: '9 cancellations excluded' },
    ],
    sources: [
      { id: 'booking', label: 'Booking.com', count: 31 },
      { id: 'hostelworld', label: 'Hostelworld', count: 19 },
      { id: 'expedia', label: 'Expedia', count: 12 },
      { id: 'direct', label: 'Direct website', count: 34 },
      { id: 'phone', label: 'Phone', count: 27 },
      { id: 'walkin', label: 'Walk-in', count: 22 },
      { id: 'whatsapp', label: 'WhatsApp', count: 14 },
    ],
    revenue: [
      { label: '4-Bed Mixed Dorm', value: 88000, currency: 'KES' },
      { label: '4-Bed Mixed Deluxe', value: 33600, currency: 'KES' },
      { label: '4-Bed Female Dorm', value: 41600, currency: 'KES' },
      { label: 'Double Private Rooms', value: 54400, currency: 'KES' },
    ],
  },
}

