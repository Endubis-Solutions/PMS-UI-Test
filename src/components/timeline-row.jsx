import { DAY_W, RAIL_W, ROW_H, BookingPill, BlockedCell } from './timeline-parts'
import { bedNumber } from '../data/core'
import { diffDays } from '../lib/format'
import { cx } from './ui'

export function BedRow({
  bed,
  letter,
  dates,
  start,
  rangeEnd,
  today,
  selected,
  bookings,
  holds,
  onOpen,
  onHover,
  onLeave,
  drag,
  dropTarget,
  onDragStart,
  onDragEnd,
  onCellDragOver,
  onCellDrop,
  highlightGroup,
  highlightHold,
}) {
  const todayIndex = diffDays(start, today)
  const trackWidth = dates.length * DAY_W
  const rowBookings = bookings.filter((booking) => booking.bed === bed)
  const rowHolds = holds.filter((hold) => hold.bed === bed)

  const position = (from, to) => {
    const left = Math.max(0, diffDays(start, from)) * DAY_W + 2
    const visibleEnd = Math.min(dates.length, diffDays(start, to)) * DAY_W
    return { left, width: Math.max(0, visibleEnd - left - 2) }
  }

  return (
    <div className="flex">
      <div
        className="sticky left-0 z-20 flex h-11 shrink-0 items-center gap-1.5 border-b border-r border-line bg-card pl-4 pr-3"
        style={{ width: RAIL_W }}
      >
        <span className="text-[11px] uppercase tracking-[0.08em] text-muted">Bed</span>
        <span className="text-[13px] font-medium text-ink">{bedNumber(bed)}</span>
        {rowHolds.length ? <span className="ml-auto text-[10px] font-medium text-muted">On hold</span> : null}
      </div>

      <div className="relative flex h-11 shrink-0 border-b border-line" style={{ width: trackWidth }}>
        {todayIndex >= 0 && todayIndex < dates.length ? (
          <div
            className="pointer-events-none absolute inset-y-0 z-0 border-x border-primary/25 bg-primary/10"
            style={{ left: todayIndex * DAY_W, width: DAY_W }}
            aria-hidden="true"
          />
        ) : null}

        {dates.map((date) => {
          const isSelected = date === selected && date !== today
          return (
            <div
              key={date}
              role="presentation"
              onDragOver={(event) => {
                event.preventDefault()
                onCellDragOver?.(bed, date)
              }}
              onDrop={(event) => {
                event.preventDefault()
                onCellDrop?.(bed, date)
              }}
              className={cx(
                'relative z-10 h-full border-r border-line/70 transition-colors duration-150',
                date === today && 'border-x border-primary/25 bg-primary/10',
                isSelected && 'bg-tint',
              )}
              style={{ width: DAY_W }}
            />
          )
        })}

        {rowHolds.map((hold) => {
          const from = hold.start > start ? hold.start : start
          const to = hold.end < rangeEnd ? hold.end : rangeEnd
          const { left, width } = position(from, to)
          if (width <= 0) return null
          return (
            <div key={hold.id} className="absolute inset-y-0 z-20" style={{ left, width, height: ROW_H }}>
              <BlockedCell
                hold={hold}
                style={{ left: 0, width }}
                highlighted={highlightHold === hold.id}
                onHoverStart={(event) =>
                  onHover?.({ kind: 'hold', id: hold.id, rect: event.currentTarget.getBoundingClientRect() })
                }
                onHoverEnd={onLeave}
              />
            </div>
          )
        })}

        {rowBookings.map((booking) => {
          const from = booking.start > start ? booking.start : start
          const to = booking.end < rangeEnd ? booking.end : rangeEnd
          const { left, width } = position(from, to)
          if (width <= 0) return null
          return (
            <div key={booking.id} className="absolute inset-y-0 z-20" style={{ left, width, height: ROW_H }}>
              <BookingPill
                booking={booking}
                style={{ left: 0, width }}
                dimmed={drag?.id === booking.id}
                highlighted={highlightGroup && booking.groupId === highlightGroup}
                onOpen={() => onOpen?.(booking)}
                onHoverStart={(event) =>
                  onHover?.({ kind: 'booking', id: booking.id, rect: event.currentTarget.getBoundingClientRect() })
                }
                onHoverEnd={onLeave}
                onDragStart={(event) => {
                  event.dataTransfer.effectAllowed = 'move'
                  event.dataTransfer.setData('text/plain', booking.id)
                  onDragStart?.(booking)
                }}
                onDragEnd={() => onDragEnd?.()}
              />
            </div>
          )
        })}

        {dropTarget?.bed === bed && dates.includes(dropTarget.date) ? (
          <div
            className={cx(
              'pointer-events-none absolute inset-y-0 z-30 ring-2 ring-inset',
              dropTarget.valid ? 'bg-primary/10 ring-primary' : 'bg-danger/15 ring-danger',
            )}
            style={{ left: dates.indexOf(dropTarget.date) * DAY_W, width: DAY_W }}
            aria-hidden="true"
          />
        ) : null}
      </div>
    </div>
  )
}
