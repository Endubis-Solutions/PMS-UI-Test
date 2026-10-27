import { useState } from 'react'
import { BedDouble, Plus } from 'lucide-react'
import { RATES, RATE_CURRENCY, TODAY, roomLabel, roomsFor } from '../data/core'
import { addDays, datesFrom, fmtDate, parseISO } from '../lib/format'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader, SectionTitle } from '../components/ui'
import { Callout, EmptyState } from '../components/feedback'
import { Field, Input, Select } from '../components/form'
import { HoldsCard } from './rates-inventory'
import { HoldDrawer } from './rates-drawers'
import { RateCalendar } from './rates-calendar'

const VIEW_DATES = datesFrom(addDays(TODAY, -1), 14)

export default function Rates() {
  const { hostel, hostelId, hostelHolds, notify } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const rooms = roomsFor(hostelId)

  const [prices, setPrices] = useState(() => {
    const next = {}
    for (const r of rooms) {
      const base = RATES[hostelId][r.id]
      for (const date of VIEW_DATES) {
        const mult = [0, 6].includes(parseISO(date).getDay()) ? 1.15 : 1
        if (typeof base === 'object') {
          next[`${r.id}|${date}`] = {
            pax1: Math.round((base.pax1 * mult) / 50) * 50,
            pax2: Math.round((base.pax2 * mult) / 50) * 50,
          }
        } else {
          next[`${r.id}|${date}`] = Math.round((base * mult) / 50) * 50
        }
      }
    }
    return next
  })

  const [roomState, setRoomState] = useState(() => {
    const map = {}
    for (const r of rooms) map[r.id] = 'open'
    return map
  })
  const toggleRoom = (id) =>
    setRoomState((current) => ({ ...current, [id]: current[id] === 'closed' ? 'open' : 'closed' }))

  const [bulkRoomId, setBulkRoomId] = useState(rooms[0]?.id ?? '')
  const bulkRoom = rooms.find((r) => r.id === bulkRoomId) ?? rooms[0]
  const bulkDouble = bulkRoom?.type === 'double'
  const [bulkFrom, setBulkFrom] = useState('2026-10-01')
  const [bulkTo, setBulkTo] = useState('2026-10-31')
  const [bulkPax1, setBulkPax1] = useState('')
  const [bulkPax2, setBulkPax2] = useState('')

  const [holds, setHolds] = useState(hostelHolds)
  const [holdOpen, setHoldOpen] = useState(state === 'hold')

  const applyBulk = () => {
    if (!bulkFrom || !bulkTo || bulkFrom > bulkTo) {
      notify({ tone: 'danger', title: 'Check the dates', description: 'The range must end after it starts.' })
      return
    }
    const base = RATES[hostelId][bulkRoom.id]
    const fallbackPax1 = typeof base === 'object' ? base.pax1 : base
    const fallbackPax2 = typeof base === 'object' ? base.pax2 : base
    const dates = []
    let d = bulkFrom
    while (d <= bulkTo) {
      dates.push(d)
      d = addDays(d, 1)
    }
    setPrices((current) => {
      const next = { ...current }
      for (const date of dates) {
        const key = `${bulkRoom.id}|${date}`
        next[key] = bulkDouble
          ? { pax1: Number(bulkPax1) || fallbackPax1, pax2: Number(bulkPax2) || fallbackPax2 }
          : Number(bulkPax1) || fallbackPax1
      }
      return next
    })
    notify({
      title: 'Prices updated',
      description: `${roomLabel(bulkRoom)} · ${fmtDate(bulkFrom)} → ${fmtDate(bulkTo)}`,
    })
  }
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BedDouble}
        title="Pricing & inventory"
        subtitle={`${hostel.short} · ${RATE_CURRENCY} per bed, per night. Changes apply to new bookings only.`}
        actions={<ActionButton icon={Plus} onClick={() => setHoldOpen(true)}>Add maintenance hold</ActionButton>}
      />

      {state === 'error' ? (
        <Callout tone="danger" title="Couldn’t load the price calendar">
          Prices and holds did not load. The last saved rates are still selling.
        </Callout>
      ) : null}

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <SectionTitle hint="Click a price to edit · toggle to open or close a room">Price calendar · all rooms</SectionTitle>
        </div>
        {state === 'empty' ? (
          <EmptyState
            icon={BedDouble}
            title="No rates for this period"
            description="Set a base rate to start selling beds."
            compact
          />
        ) : (
          <RateCalendar
            dates={VIEW_DATES}
            rooms={rooms}
            prices={prices}
            setPrices={setPrices}
            roomState={roomState}
            onToggleRoom={toggleRoom}
            loading={state === 'loading'}
          />
        )}
      </Card>

      <Card className="p-6">
        <SectionTitle hint="Applied to every night in the range">Bulk edit prices</SectionTitle>
        <p className="mt-1 max-w-[68ch] text-[12px] text-muted">
          Pick a room and a date range, then enter the new price. Double rooms take a price for 1 person and a price for 2 people.
        </p>
        <div className="mt-4 grid items-end gap-3 lg:grid-cols-[240px_1fr_1fr_1fr_1fr_auto]">
          <Field label="Room" htmlFor="bulk-room">
            <Select id="bulk-room" value={bulkRoomId} onChange={(event) => setBulkRoomId(event.target.value)}>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>{roomLabel(r)}</option>
              ))}
            </Select>
          </Field>
          <Field label="From" htmlFor="bulk-from">
            <Input id="bulk-from" type="date" value={bulkFrom} onChange={(event) => setBulkFrom(event.target.value)} />
          </Field>
          <Field label="To" htmlFor="bulk-to">
            <Input id="bulk-to" type="date" value={bulkTo} onChange={(event) => setBulkTo(event.target.value)} />
          </Field>
          <Field label="Price for 1 person (USD)" htmlFor="bulk-pax1">
            <Input id="bulk-pax1" type="number" min="0" value={bulkPax1} onChange={(event) => setBulkPax1(event.target.value)} placeholder="24" />
          </Field>
          {bulkDouble ? (
            <Field label="Price for 2 people (USD)" htmlFor="bulk-pax2">
              <Input id="bulk-pax2" type="number" min="0" value={bulkPax2} onChange={(event) => setBulkPax2(event.target.value)} placeholder="30" />
            </Field>
          ) : null}
          <ActionButton onClick={applyBulk}>Apply</ActionButton>
        </div>
      </Card>

      <HoldsCard holds={holds} onRelease={(id) => setHolds((rows) => rows.filter((row) => row.id !== id))} />

      <HoldDrawer
        open={holdOpen}
        onClose={() => setHoldOpen(false)}
        hostelId={hostelId}
        onSave={(hold) => setHolds((rows) => [hold, ...rows])}
      />
    </div>
  )
}
