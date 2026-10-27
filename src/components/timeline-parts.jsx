import { Link2, Lock } from 'lucide-react'
import { SOURCES, STATUS_STYLE, bedLabel, pillTone } from '../data/core'
import { cx } from './ui'

export const DAY_W = 44
export const ROW_H = 44
export const RAIL_W = 208

export function BookingPill({ booking, style, onOpen, onHoverStart, onHoverEnd, onDragStart, onDragEnd, highlighted, dimmed }) {
  const status = STATUS_STYLE[pillTone(booking)]
  return (
    <button
      type="button"
      draggable
      data-pill={booking.id}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onOpen}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      style={style}
      title={`${booking.guestName} · ${status.label} · ${bedLabel(booking.bed)}`}
      className={cx(
        'absolute top-[5px] flex h-[34px] items-center gap-1.5 overflow-hidden rounded-control px-2 text-left text-[12px] font-medium text-ink shadow-card transition-shadow duration-150 hover:shadow-raised',
        status.pill,
        highlighted ? 'border-2 border-primary font-semibold' : 'border border-ink/10',
        dimmed && 'opacity-40',
      )}
    >
      <span
        className={cx('h-1.5 w-1.5 shrink-0 rounded-full ring-1 ring-inset ring-ink/10', SOURCES[booking.source]?.dot)}
        aria-hidden="true"
      />
      <span className="truncate">{booking.guestName.split(' ')[0]}</span>
      {booking.groupId ? <Link2 className="h-3 w-3 shrink-0 text-ink/60" strokeWidth={2} aria-hidden="true" /> : null}
    </button>
  )
}

export function BlockedCell({ hold, style, highlighted, onHoverStart, onHoverEnd }) {
  return (
    <div
      data-pill={`hold-${hold.id}`}
      style={style}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      className={cx(
        'hatch absolute top-[5px] flex h-[34px] items-center gap-1 overflow-hidden rounded-[6px] px-1.5',
        highlighted ? 'border-2 border-primary' : 'border border-blocked/70',
      )}
      title={`${hold.reason} — maintenance hold`}
    >
      <Lock className="h-3 w-3 shrink-0 text-ink" strokeWidth={2} aria-hidden="true" />
      <span className="truncate rounded-[3px] bg-card/95 px-1 text-[10px] font-medium text-ink">Maintenance</span>
    </div>
  )
}

export function TimelineLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
      {[
        ['checked-in', 'Checked in'],
        ['reserved', 'Reserved'],
        ['unpaid', 'Unpaid balance'],
        ['cancelled', 'Cancelled / No-show'],
      ].map(([status, label]) => (
        <span key={status} className="inline-flex items-center gap-1.5">
          <span
            className={cx('h-2.5 w-2.5 rounded-[3px] border border-ink/10', STATUS_STYLE[status].dot)}
            aria-hidden="true"
          />
          {label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5">
        <span className="hatch h-2.5 w-2.5 rounded-[3px] border border-blocked/60" aria-hidden="true" />
        Blocked
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-[3px] border border-line bg-tint" aria-hidden="true" />
        Today
      </span>
    </div>
  )
}
