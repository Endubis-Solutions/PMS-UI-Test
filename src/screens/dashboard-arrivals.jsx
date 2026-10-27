import { useState } from 'react'
import { CalendarOff } from 'lucide-react'
import { STATUSES, bedLabel, bedRoom } from '../data/core'
import { fmtDate } from '../lib/format'
import { SegmentedCounter, SourceBadge, StatusDropdown } from '../components/data'
import { DataTable } from '../components/table'
import { ActionButton, Card } from '../components/ui'
import { EmptyState, Money } from '../components/feedback'

const COLUMNS = (statuses, onStatus, onUpdate, onOpen) => [
  {
    key: 'guest',
    header: 'Guest',
    width: 200,
    render: (row) => (
      <button type="button" onClick={() => onOpen(row)} className="text-left font-medium text-primary hover:text-primary-hover">
        {row.name}
        {row.guests > 1 ? <span className="ml-1.5 font-normal text-muted">· {row.guests} guests</span> : null}
      </button>
    ),
  },
  {
    key: 'source',
    header: 'Source',
    width: 150,
    render: (row) => <SourceBadge source={row.source} withLabel />,
  },
  {
    key: 'stay',
    header: 'Stay / amount',
    width: 170,
    render: (row) => (
      <div>
        <p className="text-[12px] text-muted">
          {fmtDate(row.start)} → {fmtDate(row.end)}
        </p>
        <Money amount={row.amount} currency={row.currency} className="mt-0.5 font-medium" />
      </div>
    ),
  },
  {
    key: 'bed',
    header: 'Room / bed',
    width: 190,
    render: (row) =>
      row.beds?.length ? (
        <span className="text-[13px]">
          {bedRoom(row.beds[0]).name} · {row.beds.map((bed) => bedLabel(bed)).join(', ')}
        </span>
      ) : (
        <span className="text-[13px] text-muted">{row.need ?? 'Unassigned'}</span>
      ),
  },
  {
    key: 'status',
    header: 'Status',
    width: 150,
    render: (row) => (
      <StatusDropdown
        value={statuses[row.id] ?? row.status ?? 'reserved'}
        onChange={(next) => onStatus(row.id, next)}
        options={STATUSES}
        label={`Status for ${row.name}`}
      />
    ),
  },
  {
    key: 'action',
    header: '',
    align: 'right',
    width: 110,
    render: (row) => (
      <ActionButton size="sm" onClick={() => onUpdate(row)}>
        Update
      </ActionButton>
    ),
  },
]

export function ActivityCard({ counters, bucket, onBucket, rows, selectedDate, loading, onOpen, onUpdate, onAssign, emptyCopy }) {
  const [statuses, setStatuses] = useState({})
  const setStatus = (id, next) => setStatuses((current) => ({ ...current, [id]: next }))
  const activeRows = rows[bucket] ?? []
  const active = counters.find((item) => item.id === bucket)

  return (
    <Card className="overflow-hidden">
      <div className="px-6 pt-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[14px] font-semibold text-ink">Activity</h2>
          <span className="text-[11px] text-muted">
            {active?.count ?? 0} {active?.label.toLowerCase()} · {fmtDate(selectedDate)}
          </span>
        </div>
        <SegmentedCounter items={counters} value={bucket} onChange={onBucket} className="mt-3" />
      </div>

      <DataTable
        columns={COLUMNS(statuses, setStatus, onUpdate, onOpen)}
        rows={activeRows}
        loading={loading}
        loadingRows={4}
        minWidth={900}
        empty={
          bucket === 'arrivals' ? (
            <EmptyState
              icon={CalendarOff}
              title={`No arrivals on ${fmtDate(selectedDate)}`}
              description="Nothing is due to check in for this property. Walk-ins can be booked from the calendar."
              action={<ActionButton onClick={onAssign}>Create a walk-in</ActionButton>}
              compact
            />
          ) : (
            <EmptyState
              icon={CalendarOff}
              title={emptyCopy?.title ?? 'Nothing in this list'}
              description={emptyCopy?.description ?? 'No bookings match this activity for this date.'}
              compact
            />
          )
        }
      />
    </Card>
  )
}
