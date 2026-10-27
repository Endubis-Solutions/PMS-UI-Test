import { useState } from 'react'
import { TODAY, bedLabel, bedRoom, roomsFor } from '../data/core'
import { addDays } from '../lib/format'
import { Drawer } from '../components/overlays'
import { ActionButton } from '../components/ui'
import { Field, Input, Select, Textarea } from '../components/form'
import { Callout } from '../components/feedback'

export function HoldDrawer({ open, onClose, onSave, hostelId }) {
  const beds = roomsFor(hostelId).flatMap((room) => room.beds.map((letter) => `${room.id}-${letter}`))
  const [draft, setDraft] = useState({
    bed: beds[0] ?? '',
    start: TODAY,
    end: addDays(TODAY, 2),
    reason: '',
  })

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Add maintenance hold"
      subtitle="The bed stops selling for these dates."
      width={480}
      footer={
        <div className="flex justify-end gap-2">
          <ActionButton variant="secondary" onClick={onClose}>Cancel</ActionButton>
          <ActionButton
            disabled={!draft.reason.trim() || draft.end <= draft.start}
            onClick={() => {
              onSave({ ...draft, id: `H-${Date.now()}`, hostelId, createdBy: 'Almaz Tesfaye' })
              onClose()
              setDraft({ bed: beds[0] ?? '', start: TODAY, end: addDays(TODAY, 2), reason: '' })
            }}
          >
            Place hold
          </ActionButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Field label="Bed" htmlFor="hold-bed">
          <Select id="hold-bed" value={draft.bed} onChange={(event) => setDraft({ ...draft, bed: event.target.value })}>
            {beds.map((bed) => (
              <option key={bed} value={bed}>{bedRoom(bed).name} · {bedLabel(bed)}</option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="From" htmlFor="hold-from">
            <Input id="hold-from" type="date" value={draft.start} onChange={(event) => setDraft({ ...draft, start: event.target.value })} />
          </Field>
          <Field label="To" htmlFor="hold-to">
            <Input id="hold-to" type="date" value={draft.end} onChange={(event) => setDraft({ ...draft, end: event.target.value })} />
          </Field>
        </div>
        <Field label="Reason" htmlFor="hold-reason" hint="Shown on the calendar tooltip.">
          <Textarea id="hold-reason" value={draft.reason} onChange={(event) => setDraft({ ...draft, reason: event.target.value })} placeholder="Broken window latch" />
        </Field>
        {draft.end <= draft.start ? (
          <Callout tone="danger" title="Check the dates">The hold must end after it starts.</Callout>
        ) : null}
      </div>
    </Drawer>
  )
}
