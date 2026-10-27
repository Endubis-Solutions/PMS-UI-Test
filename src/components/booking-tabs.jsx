import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { CURRENCIES, bedLabel, bedRoom, toUsd } from '../data/core'
import { chargesByCurrency, chargesUsd } from '../data/folio'
import { addDays, fmtDate, nights } from '../lib/format'
import { ActionButton } from './ui'
import { Badge, KeyValue, Money } from './feedback'
import { Checkbox, Field, Input, Select, Textarea } from './form'

export function fmtStamp(value) {
  const [date, time = ''] = value.split(' ')
  return `${fmtDate(date)}${time ? ` · ${time}` : ''}`
}

function ExtendBookingCard({ booking, onExtend }) {
  const defaultRate = booking.segments?.[booking.segments.length - 1]?.rate ?? booking.rate
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState(1)
  const [rate, setRate] = useState(defaultRate)
  const [paid, setPaid] = useState('')
  const [notPaid, setNotPaid] = useState(true)

  const count = Number(days)
  const nightRate = Number(rate)
  const additional = (count > 0 ? count : 0) * (nightRate > 0 ? nightRate : 0)
  const newEnd = addDays(booking.end, count > 0 ? count : 0)
  const valid = count > 0 && nightRate > 0

  const toggle = () => {
    if (open) {
      setOpen(false)
    } else {
      setDays(1)
      setRate(defaultRate)
      setPaid('')
      setNotPaid(true)
      setOpen(true)
    }
  }

  const submit = () => {
    if (!valid) return
    onExtend({ days: count, rate: nightRate, paid: notPaid ? 0 : Number(paid || 0) })
    setOpen(false)
  }

  return (
    <div className="rounded-control border border-line bg-page p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-ink">Extend booking</p>
        <ActionButton variant="secondary" size="sm" onClick={toggle}>
          {open ? 'Cancel' : 'Extend'}
        </ActionButton>
      </div>

      {open ? (
        <div className="mt-3 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Days to extend" htmlFor="extend-days">
              <Input
                id="extend-days"
                type="number"
                min="1"
                value={days}
                onChange={(event) => setDays(event.target.value)}
              />
            </Field>
            <Field label={`Rate (${booking.currency} / night)`} htmlFor="extend-rate">
              <Input
                id="extend-rate"
                type="number"
                min="0"
                value={rate}
                onChange={(event) => setRate(event.target.value)}
              />
            </Field>
          </div>

          <Checkbox
            id="extend-notpaid"
            label="Not paid yet"
            description="The extension amount is added to the folio balance."
            checked={notPaid}
            onChange={(event) => setNotPaid(event.target.checked)}
          />

          {!notPaid ? (
            <Field label={`Amount paid now (${booking.currency})`} htmlFor="extend-paid">
              <Input
                id="extend-paid"
                type="number"
                min="0"
                value={paid}
                onChange={(event) => setPaid(event.target.value)}
              />
            </Field>
          ) : null}

          <p className="text-[11px] text-muted">
            New check-out <span className="tnum text-ink">{fmtDate(newEnd)}</span> · adds{' '}
            <Money amount={additional} currency={booking.currency} size="sm" />.
          </p>

          <ActionButton size="sm" onClick={submit} disabled={!valid}>
            Extend booking
          </ActionButton>
        </div>
      ) : null}
    </div>
  )
}

export function BookingDetailsTab({ booking, folio, group, editing, draft, setDraft, onCancelEdit, onSave, onExtend }) {
  const segments = draft.segments ?? booking.segments ?? [{ start: booking.start, end: booking.end, rate: booking.rate }]
  const setSegments = (next) => setDraft({ ...draft, segments: next })
  const updateSegment = (index, key, value) =>
    setSegments(segments.map((segment, i) => (i === index ? { ...segment, [key]: key === 'rate' ? Number(value) : value } : segment)))
  const removeSegment = (index) => setSegments(segments.filter((_, i) => i !== index))
  const addSegment = () => {
    const last = segments[segments.length - 1] ?? { end: booking.start, rate: booking.rate }
    setSegments([...segments, { start: last.end, end: booking.end, rate: Number(last.rate) }])
  }
  return (
    <div className="flex flex-col gap-5">
      {editing ? (
        <div className="flex flex-col gap-3 rounded-control border border-line bg-page p-3">
          <Field label="Guest name" htmlFor="edit-name">
            <Input id="edit-name" value={draft.guestName ?? ''} onChange={(event) => setDraft({ ...draft, guestName: event.target.value })} />
          </Field>
          <Field label="Phone" htmlFor="edit-phone">
            <Input id="edit-phone" value={draft.phone ?? ''} onChange={(event) => setDraft({ ...draft, phone: event.target.value })} />
          </Field>
          <Field label="Notes" htmlFor="edit-notes">
            <Textarea id="edit-notes" value={draft.notes ?? ''} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} />
          </Field>

          <div className="flex flex-col gap-2 rounded-control border border-line bg-card p-3">
            <p className="text-[12px] font-medium text-ink">Rate schedule · USD</p>
            {segments.map((segment, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_90px_auto] items-end gap-2">
                <Field label="From" htmlFor={`seg-${index}-start`}>
                  <Input id={`seg-${index}-start`} type="date" value={segment.start} onChange={(event) => updateSegment(index, 'start', event.target.value)} />
                </Field>
                <Field label="To" htmlFor={`seg-${index}-end`}>
                  <Input id={`seg-${index}-end`} type="date" value={segment.end} onChange={(event) => updateSegment(index, 'end', event.target.value)} />
                </Field>
                <Field label="Rate" htmlFor={`seg-${index}-rate`}>
                  <Input id={`seg-${index}-rate`} type="number" min="0" value={segment.rate} onChange={(event) => updateSegment(index, 'rate', event.target.value)} />
                </Field>
                <button
                  type="button"
                  aria-label="Remove rate segment"
                  disabled={segments.length === 1}
                  onClick={() => removeSegment(index)}
                  className="flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-page hover:text-danger disabled:opacity-40"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
            <button type="button" onClick={addSegment} className="self-start text-[12px] font-medium text-primary hover:text-primary-hover">
              + Add rate segment
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <ActionButton variant="secondary" size="sm" onClick={onCancelEdit}>Cancel edit</ActionButton>
            <ActionButton size="sm" onClick={onSave}>Save changes</ActionButton>
          </div>
        </div>
      ) : null}

      <dl className="grid grid-cols-2 gap-4">
        <KeyValue label="Check in"><span className="tnum">{fmtDate(booking.start)}</span></KeyValue>
        <KeyValue label="Check out"><span className="tnum">{fmtDate(booking.end)}</span></KeyValue>
        <KeyValue label="Nights">{nights(booking.start, booking.end)}</KeyValue>
        <KeyValue label="Guests">{booking.guests}</KeyValue>
        <KeyValue label="Room">{bedRoom(booking.bed).name}</KeyValue>
        <KeyValue label="Bed">{bedLabel(booking.bed)}</KeyValue>
        <KeyValue label="Total"><Money amount={booking.amount} currency={booking.currency} /></KeyValue>
        <KeyValue label="Balance">
          {folio.balance > 0 ? (
            <Money amount={folio.balance} currency={booking.currency} className="font-semibold" />
          ) : (
            <Badge tone="success" dot>Paid in full</Badge>
          )}
        </KeyValue>
      </dl>

      <ExtendBookingCard booking={booking} onExtend={onExtend} />

      <div className="border-t border-line pt-4">
        <p className="text-label uppercase tracking-[0.08em] text-muted">Rate</p>
        {booking.segments?.length > 1 ? (
          <ul className="mt-2 flex flex-col gap-1.5">
            {booking.segments.map((segment, index) => (
              <li key={index} className="flex items-center justify-between text-[13px]">
                <span className="text-muted">{fmtDate(segment.start)} → {fmtDate(segment.end)}</span>
                <span className="tnum text-ink"><Money amount={segment.rate} currency={booking.currency} size="sm" /> / night</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1.5 text-[13px] text-ink">
            <Money amount={booking.rate} currency={booking.currency} /> / night
          </p>
        )}
      </div>

      <div className="border-t border-line pt-4">
        <p className="text-label uppercase tracking-[0.08em] text-muted">Contact</p>
        <div className="mt-2 flex flex-col gap-1 text-[13px] text-ink">
          <span className="tnum">{booking.phone || 'No phone on file'}</span>
          <span>{booking.email ?? `${booking.guestName.split(' ')[0].toLowerCase()}@mail.com`}</span>
        </div>
      </div>

      <div>
        <p className="text-label uppercase tracking-[0.08em] text-muted">Notes</p>
        <p className="mt-1.5 text-[13px] leading-5 text-ink">{booking.notes || 'No notes for this booking.'}</p>
      </div>

      {group.length > 1 ? (
        <div className="rounded-control border border-line bg-page p-3">
          <p className="text-[12px] font-medium text-ink">{booking.groupName} · {group.length} beds</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {group.map((member) => (
              <li key={member.id} className="flex items-center justify-between gap-2 text-[12px]">
                <span className="text-ink">{member.guestName}</span>
                <span className="tnum text-muted">{bedLabel(member.bed)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="border-t border-line pt-3 text-[11px] text-muted">
        Created {fmtStamp(booking.createdAt)} by {booking.createdBy}
      </p>
    </div>
  )
}

export function BookingFolioTab({ booking, folio, onOpenFolio, onAddCharge }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ description: '', amount: '', kind: 'Extras', currency: booking.currency })
  const [extra, setExtra] = useState([])

  const lines = [...folio.lines, ...extra]
  const breakdown = chargesByCurrency(lines, booking.currency)
  const charges = chargesUsd(lines, booking.currency)
  const balance = charges - folio.paid

  const submit = () => {
    const amount = Number(draft.amount)
    if (!draft.description.trim() || !amount) return
    const line = {
      id: `f-${Date.now()}`,
      date: '2026-09-17',
      description: draft.description.trim(),
      qty: 1,
      unit: amount,
      amount,
      kind: draft.kind,
      currency: draft.currency,
    }
    setExtra((current) => [...current, line])
    onAddCharge?.(line)
    setDraft({ description: '', amount: '', kind: 'Extras', currency: booking.currency })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-label uppercase tracking-[0.08em] text-muted">Charges</p>
        <ActionButton variant="secondary" size="sm" icon={Plus} onClick={() => setOpen((value) => !value)}>
          Add extra charge
        </ActionButton>
      </div>

      {open ? (
        <div className="flex flex-col gap-2 rounded-control border border-line bg-page p-3">
          <Field label="Description" htmlFor="drawer-charge-desc">
            <Input id="drawer-charge-desc" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </Field>
          <div className="grid grid-cols-[90px_1fr_110px] gap-2">
            <Field label="Currency" htmlFor="drawer-charge-currency">
              <Select id="drawer-charge-currency" value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
                {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
              </Select>
            </Field>
            <Field label="Type" htmlFor="drawer-charge-kind">
              <Select id="drawer-charge-kind" value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value })}>
                <option>Extras</option>
                <option>Restaurant</option>
                <option>Bar</option>
                <option>Souvenirs</option>
                <option>Laundry</option>
                <option>Tour</option>
              </Select>
            </Field>
            <Field label="Amount" htmlFor="drawer-charge-amount">
              <Input id="drawer-charge-amount" type="number" min="0" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} />
            </Field>
          </div>
          <ActionButton size="sm" onClick={submit} disabled={!draft.description.trim() || !Number(draft.amount)}>
            Add charge
          </ActionButton>
        </div>
      ) : null}

      {lines.length ? (
        <ul className="divide-y divide-line rounded-control border border-line">
          {lines.map((line) => (
            <li key={line.id} className="flex items-start justify-between gap-3 px-3 py-2.5">
              <div>
                <p className="text-[13px] text-ink">{line.description}</p>
                <p className="text-[11px] text-muted">{fmtDate(line.date)} · {line.kind}</p>
              </div>
              <Money amount={line.amount} currency={line.currency ?? booking.currency} size="sm" />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-[12px] text-muted">No charges on this folio yet.</p>
      )}

      <dl className="flex flex-col gap-1.5 text-[13px]">
        {Object.entries(breakdown).map(([code, amount]) => (
          <div key={code} className="flex justify-between">
            <dt className="text-muted">Owed · {code}</dt>
            <dd>
              <Money amount={amount} currency={code} size="sm" />
              {code !== 'USD' ? <span className="ml-1 text-[10px] text-muted">≈ {toUsd(amount, code).toLocaleString('en-US')} USD</span> : null}
            </dd>
          </div>
        ))}
        <div className="flex justify-between"><dt className="text-muted">Total (USD)</dt><dd><Money amount={charges} currency="USD" /></dd></div>
        <div className="flex justify-between"><dt className="text-muted">Paid</dt><dd><Money amount={folio.paid} currency={booking.currency} /></dd></div>
        <div className="flex justify-between border-t border-line pt-1.5 font-medium"><dt>Balance</dt><dd><Money amount={balance} currency="USD" /></dd></div>
      </dl>

      <ActionButton variant="secondary" size="sm" onClick={() => onOpenFolio(booking.id)}>Open full folio</ActionButton>
    </div>
  )
}

export function BookingActivityTab({ activity }) {
  if (!activity.length) {
    return <p className="text-[13px] text-muted">No recorded changes for this booking yet.</p>
  }
  return (
    <ol className="flex flex-col">
      {activity.map((entry) => (
        <li key={entry.id} className="relative flex gap-3 border-l border-line pb-4 pl-4 last:pb-0">
          <span className="absolute -left-[3px] top-1.5 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          <div>
            <p className="text-[13px] font-medium text-ink">{entry.action}</p>
            <p className="text-[12px] text-muted">{entry.detail}</p>
            <p className="mt-0.5 text-[11px] text-muted">{entry.at} · {entry.actor}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}


