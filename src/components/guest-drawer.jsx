import { useState } from 'react'
import { CalendarPlus, FileText, IdCard } from 'lucide-react'
import { STATUS_STYLE, bedLabel, bedRoom } from '../data/core'
import { fmtDate, initials } from '../lib/format'
import { useApp } from '../lib/store'
import { Drawer } from './overlays'
import { ActionButton } from './ui'
import { Avatar, Badge, Money } from './feedback'
import { Textarea } from './form'
import { GuestForm } from './guest-new'

export function GuestDrawer({ guest, isNew, bookings, onClose, onCreate, onNewBooking, onOpenFolio }) {
  const { guestNotes, updateGuestNote, notify } = useApp()
  const [draft, setDraft] = useState(null)
  const [editingNotes, setEditingNotes] = useState(false)
  const [noteDraft, setNoteDraft] = useState('')

  if (isNew) {
    return (
      <Drawer
        open
        onClose={onClose}
        title="Add guest"
        subtitle="A profile is enough to start; ID is captured at check-in."
        width={480}
      >
        <GuestForm draft={draft} setDraft={setDraft} onCreate={onCreate} onClose={onClose} />
      </Drawer>
    )
  }

  if (!guest) return null
  const stays = bookings.filter((booking) => booking.guestName === guest.name)

  return (
    <Drawer
      open
      onClose={onClose}
      header={
        <div className="flex items-start gap-3">
          <Avatar initials={initials(guest.name)} size="lg" />
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-semibold leading-6 text-ink">{guest.name}</h2>
            <p className="mt-0.5 text-[12px] text-muted">{guest.country} · {guest.stays} stays</p>
            <div className="mt-2">
              {guest.balance > 0 ? (
                <Badge tone="warning" dot>
                  Balance <Money amount={guest.balance} currency={guest.currency} size="sm" />
                </Badge>
              ) : (
                <Badge tone="success" dot>No balance</Badge>
              )}
            </div>
          </div>
        </div>
      }
      footer={
        <div className="grid grid-cols-2 gap-2">
          <ActionButton icon={CalendarPlus} onClick={onNewBooking}>New booking</ActionButton>
          <ActionButton variant="secondary" icon={FileText} onClick={() => onOpenFolio(guest.folio)}>
            Open folio
          </ActionButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-3">
          <div className="flex h-[92px] w-[120px] shrink-0 flex-col items-center justify-center rounded-control border border-line bg-page text-center">
            <IdCard className="h-5 w-5 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <span className="mt-1.5 px-2 text-[10px] leading-3 text-muted">Passport photo on file</span>
          </div>
          <div>
            <p className="text-label uppercase tracking-[0.08em] text-muted">Identity</p>
            <p className="mt-1 text-[13px] text-ink">{guest.doc}</p>
            <p className="mt-1 text-[11px] leading-4 text-muted">Checked at first stay · never shared with third parties.</p>
          </div>
        </div>

        <div className="border-t border-line pt-4">
          <p className="text-label uppercase tracking-[0.08em] text-muted">Contact</p>
          <div className="mt-2 flex flex-col gap-1 text-[13px] text-ink">
            <span className="tnum">{guest.phone || 'No phone on file'}</span>
            <span>{guest.email || 'No email on file'}</span>
          </div>
        </div>

        <div>
          <p className="text-label uppercase tracking-[0.08em] text-muted">Notes</p>
          {editingNotes ? (
            <div className="mt-1.5 flex flex-col gap-2">
              <Textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} />
              <div className="flex justify-end gap-2">
                <ActionButton variant="secondary" size="sm" onClick={() => setEditingNotes(false)}>Cancel</ActionButton>
                <ActionButton
                  size="sm"
                  onClick={() => {
                    updateGuestNote(guest.id, noteDraft.trim())
                    setEditingNotes(false)
                    notify({ title: 'Note saved', description: `${guest.name} · note kept for future stays.` })
                  }}
                >
                  Save note
                </ActionButton>
              </div>
            </div>
          ) : (
            <>
              <p className="mt-1.5 text-[13px] leading-5 text-ink">{(guestNotes[guest.id] ?? guest.notes) || 'No notes for this guest.'}</p>
              <button
                type="button"
                onClick={() => {
                  setNoteDraft(guestNotes[guest.id] ?? guest.notes)
                  setEditingNotes(true)
                }}
                className="mt-1 text-[12px] font-medium text-primary hover:text-primary-hover"
              >
                Edit note
              </button>
            </>
          )}
        </div>

        <div>
          <p className="text-label uppercase tracking-[0.08em] text-muted">Stay history</p>
          {stays.length ? (
            <ul className="mt-2 divide-y divide-line rounded-control border border-line">
              {stays.map((stay) => (
                <li key={stay.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                  <div>
                    <p className="text-[13px] text-ink">
                      {fmtDate(stay.start)} → {fmtDate(stay.end)}
                    </p>
                    <p className="text-[11px] text-muted">
                      {bedRoom(stay.bed).name} · {bedLabel(stay.bed)} · {stay.id}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Money amount={stay.amount} currency={stay.currency} size="sm" />
                    <span className="text-[10px] text-muted">{STATUS_STYLE[stay.status].label}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1.5 text-[13px] text-muted">No stays recorded at this property yet.</p>
          )}
        </div>
      </div>
    </Drawer>
  )
}
