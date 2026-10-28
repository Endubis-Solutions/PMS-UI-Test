import { RATE_CURRENCY, rateFor, roomsFor } from '../data/core'
import { addDays, fmtDay, parseISO } from '../lib/format'
import { cx } from './ui'
import { DAY_W, RAIL_W } from './timeline-parts'
import { BedRow } from './timeline-row'

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export function TimelineGrid(props) {
  const { dates, start, today, selected, hostelId, bookings, holds, highlightGroup, highlightHold, onScroll } = props
  const rooms = props.rooms ?? roomsFor(hostelId)
  const trackWidth = dates.length * DAY_W
  const rangeEnd = addDays(dates[dates.length - 1], 1)

  const monthSegments = []
  for (let i = 0; i < dates.length; ) {
    const monthKey = dates[i].slice(0, 7)
    const label = `${MONTH_NAMES[parseISO(dates[i]).getMonth()]} ${parseISO(dates[i]).getFullYear()}`
    let j = i
    while (j < dates.length && dates[j].slice(0, 7) === monthKey) j += 1
    monthSegments.push({ key: monthKey, label, width: (j - i) * DAY_W })
    i = j
  }

  return (
    <div className="relative max-h-[calc(100vh-18rem)] min-h-[300px] overflow-auto" data-timeline-scroll onScroll={onScroll}>
      <div style={{ width: RAIL_W + trackWidth }}>
        <div className="sticky top-0 z-30 bg-card">
          <div className="flex">
            <div
              className="sticky left-0 z-40 flex h-7 shrink-0 items-center border-b border-r border-line bg-card"
              style={{ width: RAIL_W }}
            />
            {monthSegments.map((segment) => (
              <div
                key={segment.key}
                className="flex h-7 shrink-0 items-center overflow-hidden whitespace-nowrap border-b border-l border-line bg-card px-2 text-[12px] font-medium text-ink"
                style={{ width: segment.width }}
              >
                {segment.label}
              </div>
            ))}
          </div>
          <div className="flex">
            <div
              className="sticky left-0 z-40 flex h-12 shrink-0 items-end border-b border-r border-line bg-card px-4 pb-2"
              style={{ width: RAIL_W }}
            >
              <span className="text-label uppercase tracking-[0.08em] text-muted">Room / bed</span>
            </div>
            {dates.map((date) => {
              const isToday = date === today
              const isSelected = date === selected && !isToday
              return (
                <div
                  key={date}
                  className={cx(
                    'flex h-12 shrink-0 flex-col items-center justify-end border-b border-line pb-1.5',
                    isToday ? 'bg-primary text-white' : isSelected ? 'bg-tint text-primary' : 'bg-card text-ink',
                  )}
                  style={{ width: DAY_W }}
                >
                  <span
                    className={cx(
                      'text-[9px] uppercase tracking-[0.06em]',
                      isToday ? 'text-white' : isSelected ? 'text-primary' : 'text-muted',
                    )}
                  >
                    {fmtDay(date)}
                  </span>
                  <span className="tnum text-[12px] font-medium leading-4">{parseISO(date).getDate()}</span>
                </div>
              )
            })}
          </div>
        </div>

        {rooms.map((room) => {
          const roomBeds = room.beds.map((letter) => `${room.id}-${letter}`)
          const occupied = roomBeds.filter((bed) =>
            bookings.some((booking) => booking.bed === bed && booking.start <= today && booking.end > today),
          ).length
          return (
            <div key={room.id}>
              <div className="flex">
                <div
                  className="sticky left-0 z-20 flex h-9 shrink-0 items-center gap-2 border-b border-r border-line bg-page pl-4 pr-3"
                  style={{ width: RAIL_W }}
                >
                  <span className="text-[12px] font-semibold text-ink">{room.name}</span>
                  <span className="tnum text-[11px] text-muted">
                    {occupied}/{room.beds.length} booked
                  </span>
                  <span className="ml-auto text-[10px] uppercase tracking-[0.06em] text-muted">
                    {RATE_CURRENCY}
                  </span>
                  <span className="tnum text-[11px] text-muted">
                    {rateFor(hostelId, room.id).toLocaleString('en-US')}
                  </span>
                </div>
                <div className="h-9 shrink-0 border-b border-line bg-page" style={{ width: trackWidth }} />
              </div>

              {room.beds.map((letter) => (
                <BedRow
                  key={`${room.id}-${letter}`}
                  {...props}
                  bed={`${room.id}-${letter}`}
                  letter={letter}
                  rangeEnd={rangeEnd}
                  highlightGroup={highlightGroup}
                  highlightHold={highlightHold}
                  bookings={bookings}
                  holds={holds}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
