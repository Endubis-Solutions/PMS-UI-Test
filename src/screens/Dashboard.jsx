import { useMemo, useState } from 'react'
import { CalendarDays, Plus } from 'lucide-react'
import { TODAY } from '../data/core'
import { fmtLong } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, PageHeader } from '../components/ui'
import { ActivityCard } from './dashboard-arrivals'
import { DashboardCards } from './dashboard-cards'
import { bedStats, buildDashboard, freeByRoom } from './dashboard-data'

export default function Dashboard() {
  const { hostel, hostelId, hostelBookings, hostelHolds, notify } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const loading = state === 'loading'
  const [retried, setRetried] = useState(false)
  const [bucket, setBucket] = useState('arrivals')
  const [selectedDate, setSelectedDate] = useState(query.date ?? TODAY)
  const failed = state === 'error' && !retried

  const data = useMemo(() => buildDashboard(hostelBookings, hostelId, state === 'empty', selectedDate), [hostelBookings, hostelId, state, selectedDate])
  const stats = useMemo(() => bedStats(hostelBookings, hostelHolds, hostelId, selectedDate), [hostelBookings, hostelHolds, hostelId, selectedDate])
  const freeRooms = useMemo(() => freeByRoom(hostelBookings, hostelId, selectedDate), [hostelBookings, hostelId, selectedDate])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={CalendarDays}
        title="Dashboard"
        subtitle={`${fmtLong(selectedDate)} · arrivals, departures and occupancy for this date.`}
        actions={
          <>
            <label className="flex h-9 items-center gap-2 rounded-control border border-line bg-card px-2.5 text-[13px] text-ink transition-colors hover:border-blocked focus-within:border-primary">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                aria-label="Select date"
                className="bg-transparent text-[13px] text-ink outline-none"
              />
            </label>
            <ActionButton icon={Plus} onClick={() => navigate('/new-booking')}>
              New booking
            </ActionButton>
          </>
        }
      />

      <DashboardCards
        hostel={hostel}
        hostelId={hostelId}
        hostelBookings={hostelBookings}
        stats={stats}
        freeRooms={freeRooms}
        counters={data.counters}
        selectedDate={selectedDate}
        loading={loading}
        failed={failed}
        onRetry={() => setRetried(true)}
      />

      {!failed ? (
        <ActivityCard
          counters={data.counters}
          bucket={bucket}
          onBucket={setBucket}
          rows={data.rows}
          selectedDate={selectedDate}
          loading={loading}
          onOpen={(row) => navigate(`/calendar?booking=${row.bookingId}`)}
          onUpdate={(row) =>
            notify({
              title: `${row.name} updated`,
              description: 'The new status is saved to the booking and written to the audit log.',
            })
          }
          onAssign={() => navigate('/new-booking')}
        />
      ) : null}
    </div>
  )
}
