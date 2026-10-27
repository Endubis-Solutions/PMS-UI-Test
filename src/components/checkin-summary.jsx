import { bedLabel, bedRoom } from '../data/core'
import { fmtDate, nights } from '../lib/format'
import { Money } from './feedback'

export function CheckInSummary({ booking }) {
  return (
    <div className="rounded-control border border-line bg-page p-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13px] font-medium text-ink">{booking.guestName}</p>
          <p className="text-[11px] text-muted">
            {booking.id} · {fmtDate(booking.start)} → {fmtDate(booking.end)} · {nights(booking.start, booking.end)} nights
          </p>
          <p className="text-[11px] text-muted">
            {booking.email} · {booking.phone || 'No phone on file'}
          </p>
        </div>
        <span className="shrink-0 rounded-[6px] border border-line bg-card px-2 py-1 text-[11px] text-ink">
          {bedRoom(booking.bed).name} · {bedLabel(booking.bed)}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-2 text-[11px]">
        <div>
          <p className="text-muted">Total</p>
          <Money amount={booking.amount} currency={booking.currency} size="sm" />
        </div>
        <div>
          <p className="text-muted">Paid</p>
          <Money amount={booking.amount - booking.balance} currency={booking.currency} size="sm" />
        </div>
        <div>
          <p className="text-muted">Balance</p>
          <Money amount={booking.balance} currency={booking.currency} size="sm" className="font-semibold" />
        </div>
      </div>
    </div>
  )
}
