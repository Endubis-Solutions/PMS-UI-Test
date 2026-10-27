import { useState } from 'react'
import { ActionButton } from './ui'
import { Field, Input } from './form'

const EMPTY = { name: '', country: '', phone: '', email: '' }

export function GuestForm({ draft, setDraft, onCreate, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const value = draft ?? form
  const update = setDraft ?? setForm

  return (
    <div className="flex flex-col gap-4">
      <Field label="Full name" htmlFor="new-name" required>
        <Input
          id="new-name"
          value={value.name}
          onChange={(event) => update({ ...value, name: event.target.value })}
          placeholder="As shown on the passport"
        />
      </Field>
      <Field label="Country" htmlFor="new-country">
        <Input
          id="new-country"
          value={value.country}
          onChange={(event) => update({ ...value, country: event.target.value })}
          placeholder="Japan"
        />
      </Field>
      <Field label="Phone" htmlFor="new-phone">
        <Input
          id="new-phone"
          value={value.phone}
          onChange={(event) => update({ ...value, phone: event.target.value })}
          placeholder="+81 90 0000 0000"
        />
      </Field>
      <Field label="Email" htmlFor="new-email" hint="Used for the booking confirmation.">
        <Input
          id="new-email"
          type="email"
          value={value.email}
          onChange={(event) => update({ ...value, email: event.target.value })}
          placeholder="guest@mail.com"
        />
      </Field>
      <div className="flex justify-end gap-2 border-t border-line pt-4">
        <ActionButton variant="secondary" onClick={onClose}>Cancel</ActionButton>
        <ActionButton
          disabled={!value.name.trim()}
          onClick={() =>
            onCreate({
              id: `g-${Date.now()}`,
              name: value.name.trim(),
              country: value.country.trim() || '—',
              phone: value.phone.trim(),
              email: value.email.trim(),
              stays: 0,
              nights: 0,
              lastStay: '2026-09-17',
              doc: 'No ID on file',
              notes: '',
              balance: 0,
              currency: 'ETB',
              folio: '',
            })
          }
        >
          Save guest
        </ActionButton>
      </div>
    </div>
  )
}
