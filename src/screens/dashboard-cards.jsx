import { CalendarDays } from 'lucide-react'
import { RATE_CURRENCY, TODAY, rateFor } from '../data/core'
import { fmtDate, parseISO } from '../lib/format'
import { StatCard } from '../components/data'
import { Callout, Money, Skeleton } from '../components/feedback'
import { ActionButton, cx } from '../components/ui'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function DashboardCards({ hostel, hostelId, hostelBookings, stats, freeRooms, counters, loading, failed, onRetry, selectedDate }) {
  const weekday = WEEKDAYS[parseISO(selectedDate).getDay()]
  const isToday = selectedDate === TODAY
  if (loading) {
    return (
      <div className="grid gap-4 lg:grid-cols-3">
        {[0, 1, 2].map((key) => (
          <div key={key} className="rounded-card border border-line bg-card p-6">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-4 h-9 w-28" />
            <Skeleton className="mt-3 h-3 w-40" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      {failed ? (
        <Callout
          tone="danger"
          title="Couldn’t load this date’s activity"
          action={
            <ActionButton variant="secondary" size="sm" onClick={onRetry}>
              Try again
            </ActionButton>
          }
        >
          The counters and the arrivals table did not load. Beds and rates are still current.
        </Callout>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label={isToday ? 'Today' : 'Selected date'}
          footer={
            <span className="text-[11px] text-muted">
              {counters[0].count} arrivals · {counters[1].count} departures
            </span>
          }
        >
          <p className="tnum text-stat font-bold text-ink">{fmtDate(selectedDate)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-[13px] text-muted">
            <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
            {weekday}
          </p>
        </StatCard>

        <StatCard label="Rates by room type" footer={<span className="text-[11px] text-muted">Per bed, per night · {RATE_CURRENCY}</span>}>
          <ul className="flex flex-col gap-2">
            {freeRooms.map((room) => (
              <li key={room.id} className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2 text-[13px] text-ink">
                  <span
                    className={cx('h-1.5 w-1.5 shrink-0 rounded-full', room.free > 0 ? 'bg-success' : 'bg-blocked')}
                    aria-hidden="true"
                  />
                  <span className="truncate">{room.name}</span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  <Money amount={rateFor(hostelId, room.id)} currency={RATE_CURRENCY} size="sm" />
                  <span className="tnum w-10 text-right text-[11px] text-muted">{room.free} free</span>
                </span>
              </li>
            ))}
          </ul>
        </StatCard>

        <StatCard
          label="Occupancy"
          footer={
            <div className="flex items-center justify-between text-[11px] text-muted">
              <span>{stats.freeBeds} beds free</span>
              <span>{stats.holdsToday} on hold</span>
            </div>
          }
        >
          <div className="flex items-baseline gap-2">
            <span className="tnum text-stat font-bold text-ink">
              {stats.occupied} / {stats.beds.length}
            </span>
            <span className="tnum text-[13px] text-muted">{stats.pct}%</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary" style={{ width: `${stats.pct}%` }} />
          </div>
          <p className="mt-2 text-[11px] text-muted">Beds sold on this date across all room types.</p>
        </StatCard>
      </div>
    </>
  )
}
