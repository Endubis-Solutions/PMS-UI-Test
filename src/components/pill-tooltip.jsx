import { Link2, Lock, MoveRight } from 'lucide-react'
import { SOURCES, STATUS_STYLE, bedLabel, bedRoom } from '../data/core'
import { Badge, Money } from './feedback'
import { fmtDate, fmtNights, nights } from '../lib/format'
import { cx } from './ui'

export function PillTooltip({ hover, bookings, holds }) {
  if (!hover) return null
  const width = 268
  const left = Math.max(12, Math.min(hover.rect.left, window.innerWidth - width - 12))
  const top = hover.rect.bottom + 8
  const isHold = hover.kind === 'hold'
  const booking = !isHold ? bookings.find((item) => item.id === hover.id) : null
  const hold = isHold ? holds.find((item) => item.id === hover.id) : null
  if (!booking && !hold) return null

  return (
    <div
      role="tooltip"
      className="pointer-events-none fixed z-[70] animate-fade-in rounded-card border border-line bg-card p-3 shadow-raised"
      style={{ left, top, width }}
    >
      {booking ? (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">{booking.guestName}</p>
            <Badge
              tone={booking.status === 'checked-in' ? 'success' : booking.status === 'reserved' ? 'primary' : 'blocked'}
              dot
            >
              {STATUS_STYLE[booking.status].label}
            </Badge>
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            <span className={cx('h-2 w-2 rounded-full', SOURCES[booking.source]?.dot)} aria-hidden="true" />
            <span className="text-[11px] text-muted">{SOURCES[booking.source]?.label}</span>
            <span className="text-[11px] text-muted">· {booking.id}</span>
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-line pt-2 text-[11px]">
            <div>
              <dt className="text-muted">Stay</dt>
              <dd className="text-ink">
                {fmtDate(booking.start)} → {fmtDate(booking.end)}
              </dd>
            </div>
            <div>
              <dt className="text-muted">Nights</dt>
              <dd className="tnum text-ink">{nights(booking.start, booking.end)}</dd>
            </div>
            <div>
              <dt className="text-muted">Bed</dt>
              <dd className="text-ink">{bedLabel(booking.bed)}</dd>
            </div>
            <div>
              <dt className="text-muted">Balance</dt>
              <dd className="text-ink">
                {booking.balance > 0 ? <Money amount={booking.balance} currency={booking.currency} /> : 'Paid'}
              </dd>
            </div>
          </dl>
          {booking.groupId ? (
            <p className="mt-2 flex items-center gap-1.5 rounded-[6px] bg-page px-2 py-1 text-[11px] text-ink">
              <Link2 className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
              Linked group · {booking.groupName}
            </p>
          ) : null}
          <p className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
            Open booking <MoveRight className="h-3 w-3" strokeWidth={2} aria-hidden="true" />
          </p>
        </>
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <p className="text-[13px] font-semibold text-ink">{hold.reason}</p>
            <Badge tone="blocked" icon={Lock}>
              Hold
            </Badge>
          </div>
          <p className="mt-1 text-[11px] text-muted">
            {bedRoom(hold.bed).name} · {bedLabel(hold.bed)}
          </p>
          <p className="mt-2 border-t border-line pt-2 text-[11px] text-ink">
            {fmtDate(hold.start)} → {fmtDate(hold.end)} · {fmtNights(nights(hold.start, hold.end))}
          </p>
          <p className="mt-1 text-[11px] text-muted">Placed by {hold.createdBy}</p>
        </>
      )}
    </div>
  )
}
