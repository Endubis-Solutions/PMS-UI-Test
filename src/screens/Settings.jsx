import { useState } from 'react'
import { Plus, Settings as SettingsIcon, Trash2 } from 'lucide-react'
import { initials } from '../lib/format'
import { useApp } from '../lib/store'
import { ActionButton, Card, PageHeader, SectionTitle, cx } from '../components/ui'
import { Avatar, Badge } from '../components/feedback'
import { Field, Input, Select } from '../components/form'

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-150',
        checked ? 'bg-primary' : 'bg-line',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span
        className={cx(
          'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-150',
          checked ? 'translate-x-5' : 'translate-x-0.5',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

export default function Settings() {
  const { user, hostels, staff, addStaff, removeStaff, features, setFeature, notify } = useApp()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ name: '', email: '', hostelId: 'addis' })
  const hostelName = (id) => hostels.find((property) => property.id === id)?.short ?? id

  const submit = () => {
    if (!draft.name.trim() || !draft.email.trim()) return
    addStaff({
      id: `u-${Date.now()}`,
      name: draft.name.trim(),
      email: draft.email.trim(),
      role: 'staff',
      hostelId: draft.hostelId,
      title: 'Front desk',
      initials: initials(draft.name.trim()),
    })
    notify({ title: 'Staff added', description: `${draft.name} can now sign in.` })
    setDraft({ name: '', email: '', hostelId: 'addis' })
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={SettingsIcon}
        title="Settings"
        subtitle="Manage staff accounts and turn features on or off."
      />

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <SectionTitle hint={`${staff.length} accounts`}>Staff accounts</SectionTitle>
          <ActionButton variant="secondary" size="sm" icon={Plus} onClick={() => setOpen((value) => !value)}>
            Add staff
          </ActionButton>
        </div>

        {open ? (
          <div className="grid items-end gap-2 border-y border-line bg-page px-6 py-3 sm:grid-cols-[1fr_1fr_160px_auto]">
            <Field label="Full name" htmlFor="staff-name">
              <Input id="staff-name" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="Full name" />
            </Field>
            <Field label="Email" htmlFor="staff-email">
              <Input id="staff-email" type="email" value={draft.email} onChange={(event) => setDraft({ ...draft, email: event.target.value })} placeholder="name@madvervet.com" />
            </Field>
            <Field label="Property" htmlFor="staff-hostel">
              <Select id="staff-hostel" value={draft.hostelId} onChange={(event) => setDraft({ ...draft, hostelId: event.target.value })}>
                {hostels.map((property) => <option key={property.id} value={property.id}>{property.short}</option>)}
              </Select>
            </Field>
            <ActionButton onClick={submit} disabled={!draft.name.trim() || !draft.email.trim()}>Add</ActionButton>
          </div>
        ) : null}

        <ul className="divide-y divide-line">
          {staff.map((account) => (
            <li key={account.id} className="flex items-center justify-between gap-3 px-6 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar initials={account.initials ?? initials(account.name)} />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-ink">{account.name}</p>
                  <p className="truncate text-[11px] text-muted">{account.email} · {hostelName(account.hostelId)}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge tone={account.role === 'admin' ? 'primary' : 'neutral'}>{account.role}</Badge>
                <ActionButton
                  variant="danger"
                  size="sm"
                  icon={Trash2}
                  aria-label={`Remove ${account.name}`}
                  disabled={account.id === user?.id || account.role === 'admin'}
                  onClick={() => {
                    removeStaff(account.id)
                    notify({ title: 'Staff removed', description: `${account.name} no longer has access.` })
                  }}
                >
                  Remove
                </ActionButton>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 py-4">
          <SectionTitle hint="Property-wide">Features</SectionTitle>
        </div>
        <ul className="divide-y divide-line border-t border-line">
          <li className="flex items-start justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-ink">Email parsing</p>
              <p className="mt-0.5 text-[12px] text-muted">Read booking emails and turn them into reservations.</p>
            </div>
            <Toggle checked={features.emailParsing} onChange={(value) => setFeature('emailParsing', value)} />
          </li>
          <li className="flex items-start justify-between gap-4 px-6 py-4">
            <div>
              <p className="text-[14px] font-medium text-ink">OTA parsing</p>
              <p className="mt-0.5 text-[12px] text-muted">Pull reservations from Booking.com, Hostelworld and Expedia.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="blocked">Coming later</Badge>
              <Toggle checked={features.otaParsing} onChange={(value) => setFeature('otaParsing', value)} disabled />
            </div>
          </li>
        </ul>
      </Card>
    </div>
  )
}