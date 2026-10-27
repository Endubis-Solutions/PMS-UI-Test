import { toUsd } from './core'

// Groups folio lines by currency so the guest's outstanding amount can be
// shown per currency, then summarised in USD.
export function chargesByCurrency(lines, fallback = 'USD') {
  const by = {}
  lines.forEach((line) => {
    const code = line.currency ?? fallback
    by[code] = (by[code] ?? 0) + line.amount
  })
  return by
}

export function chargesUsd(lines, fallback = 'USD') {
  return Object.entries(chargesByCurrency(lines, fallback)).reduce(
    (sum, [code, amount]) => sum + toUsd(amount, code),
    0,
  )
}

export const FOLIO_LINES = {
  'BK-2419': [
    { id: 'f1', date: '2026-09-17', description: 'Bed C · 4 nights', qty: 4, unit: 12, amount: 48, kind: 'Room' },
    { id: 'f2', date: '2026-09-18', description: 'Breakfast · 2 covers', qty: 2, unit: 7, amount: 14, kind: 'Restaurant' },
    { id: 'f3', date: '2026-09-18', description: 'Laundry · 3 loads', qty: 1, unit: 3, amount: 3, kind: 'Extras' },
  ],
}

export const FOLIO_PAYMENTS = {
  'BK-2419': [
    { id: 'p1', date: '2026-09-02', description: 'Deposit · Direct website', amount: 10, method: 'Card' },
  ],
}

export function getFolio(booking, bedRoom, nights) {
  if (!booking) return { lines: [], payments: [], charges: 0, paid: 0, balance: 0 }
  const lines =
    FOLIO_LINES[booking.id] ??
    [
      {
        id: 'room',
        date: booking.start,
        description: `${bedRoom(booking.bed).name} · ${nights(booking.start, booking.end)} nights`,
        qty: nights(booking.start, booking.end),
        unit: Math.round(booking.amount / Math.max(1, nights(booking.start, booking.end))),
        amount: booking.amount,
        kind: 'Room',
      },
    ]
  const paid = booking.amount - booking.balance
  const payments =
    FOLIO_PAYMENTS[booking.id] ??
    (paid > 0
      ? [{ id: 'deposit', date: booking.start, description: 'Deposit received', amount: paid, method: 'Card' }]
      : [])
  const charges = lines.reduce((sum, line) => sum + line.amount, 0)
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  return { lines, payments, charges, paid: totalPaid, balance: charges - totalPaid }
}
