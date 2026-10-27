import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { STATUSES } from '../data/core'
import { ActionButton, Card, IconBadge, SectionTitle } from '../components/ui'
import { SourceBadge, SegmentedCounter, StatusDropdown } from '../components/data'
import { Badge, Money } from '../components/feedback'
import { DataTable } from '../components/table'
import { BookingPill, BlockedCell } from '../components/timeline-parts'

const PILL_BOOKINGS = [
  { id: 'p1', guestName: 'Mei Tanaka', status: 'reserved', source: 'whatsapp', bed: 'hawassa-C', start: '2026-09-17', end: '2026-09-21', balance: 4800 },
  { id: 'p2', guestName: 'Amara Okafor', status: 'checked-in', source: 'phone', bed: 'hawassa-A', start: '2026-09-14', end: '2026-09-18', balance: 0 },
  { id: 'p3', guestName: 'Ana Sousa', status: 'checked-out', source: 'direct', bed: 'female6-D', start: '2026-09-14', end: '2026-09-17', balance: 0 },
]

export function ButtonsSheet() {
  return (
    <Card className="p-6">
      <SectionTitle hint="One primary action per view">ActionButton</SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <ActionButton icon={Plus}>Primary</ActionButton>
        <ActionButton variant="secondary">Secondary</ActionButton>
        <ActionButton variant="tint">Tint</ActionButton>
        <ActionButton variant="ghost">Ghost</ActionButton>
        <ActionButton variant="danger">Danger</ActionButton>
        <ActionButton variant="dangerSolid">Danger solid</ActionButton>
        <ActionButton loading>Loading</ActionButton>
        <ActionButton disabled>Disabled</ActionButton>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <ActionButton size="sm">Small</ActionButton>
        <ActionButton size="lg" icon={Search}>Large</ActionButton>
      </div>
    </Card>
  )
}

export function BadgesSheet() {
  const [status, setStatus] = useState('reserved')
  return (
    <Card className="p-6">
      <SectionTitle hint="Dot plus text, never colour alone">Badges and status</SectionTitle>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge>Neutral</Badge>
        <Badge tone="primary" dot>Reserved</Badge>
        <Badge tone="success" dot>Paid</Badge>
        <Badge tone="warning" dot>Needs attention</Badge>
        <Badge tone="danger">Failed</Badge>
        <Badge tone="blocked">Cancelled</Badge>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-line pt-4">
        {['direct', 'walkin', 'phone', 'whatsapp', 'booking', 'hostelworld', 'expedia'].map((source) => (
          <SourceBadge key={source} source={source} withLabel />
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-line pt-4">
        <StatusDropdown value={status} onChange={setStatus} options={STATUSES} />
        <span className="flex items-center gap-2">
          <IconBadge icon={Plus} size="sm" />
          <IconBadge icon={Plus} />
        </span>
      </div>
    </Card>
  )
}

export function PillsSheet() {
  return (
    <Card className="p-6">
      <SectionTitle hint="Fill is status, dot is source">BookingPill and BlockedCell</SectionTitle>
      <div className="mt-4 flex flex-col gap-3">
        {PILL_BOOKINGS.map((booking) => (
          <div key={booking.id} className="relative h-11 w-[240px] rounded-[6px] border border-line bg-page">
            <BookingPill booking={booking} style={{ left: 0, width: 220 }} />
          </div>
        ))}
        <div className="relative h-11 w-[240px] rounded-[6px] border border-line bg-page">
          <BlockedCell
            hold={{ id: 'H-31', reason: 'Broken window latch', bed: 'bale-A', start: '2026-09-18', end: '2026-09-21', createdBy: 'Almaz' }}
            style={{ left: 0, width: 220 }}
          />
        </div>
      </div>
    </Card>
  )
}

export function DataSheet() {
  const [bucket, setBucket] = useState('arrivals')
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-6">
        <SectionTitle>StatCard · SegmentedCounter</SectionTitle>
        <div className="mt-4 rounded-card border border-line p-4">
          <p className="text-label uppercase tracking-[0.08em] text-muted">Occupancy</p>
          <p className="tnum mt-2 text-stat font-bold text-ink">13 / 16</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[81%] rounded-full bg-primary" />
          </div>
        </div>
        <div className="mt-4">
          <SegmentedCounter
            items={[
              { id: 'arrivals', label: 'Arrivals', count: 5 },
              { id: 'departures', label: 'Departures', count: 3 },
              { id: 'waiting', label: 'Waiting list', count: 2 },
            ]}
            value={bucket}
            onChange={setBucket}
          />
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-4"><SectionTitle hint="Uppercase header">DataTable</SectionTitle></div>
        <DataTable
          minWidth={420}
          rows={[
            { id: 'r1', name: 'Mei Tanaka', source: 'whatsapp', amount: 4800, currency: 'ETB' },
            { id: 'r2', name: 'Lukas Meyer', source: 'direct', amount: 8400, currency: 'ETB' },
          ]}
          columns={[
            { key: 'name', header: 'Guest', render: (row) => <span className="font-medium text-ink">{row.name}</span> },
            { key: 'source', header: 'Source', render: (row) => <SourceBadge source={row.source} withLabel /> },
            { key: 'amount', header: 'Balance', align: 'right', render: (row) => <Money amount={row.amount} currency={row.currency} /> },
          ]}
        />
      </Card>
    </div>
  )
}
