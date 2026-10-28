import { useMemo, useState } from 'react'
import { bedLabel, bedRoom, roomsFor } from '../data/core'
import { addDays, fmtDate, nights, overlaps } from '../lib/format'
import { useApp } from '../lib/store'
import { Modal } from './overlays'
import { ActionButton } from './ui'
import { Callout } from './feedback'
import { Field, Input, Select } from './form'

export function MoveBookingModal({ bookingId, onClose }) {
  const { hostelId, hostelBookings, hostelHolds, moveBooking, notify } = useApp()
  const booking = hostelBookings.find((item) => item.id === bookingId)
  const [bed, setBed] = useState(booking?.bed ?? '')
  const [start, setStart] = useState(booking?.start ?? '')

  const beds = useMemo(
    () => roomsFor(hostelId).flatMap((room) => room.beds.map((letter) => `${room.id}-${letter}`)),
    [hostelId],
  )

  if (!booking) return null

  const duration = Math.max(1, nights(booking.start, booking.end))
  const end = addDays(start || booking.start, duration)
  const conflict = (() => {
    if (!bed || !start) return null
    const hit = hostelBookings.find(
      (item) => item.bed === bed && item.id !== booking.id && overlaps(item.start, item.end, start, end),
    )
    if (hit) return { label: hit.guestName, hold: false }
    const hold = hostelHolds.find((item) => item.bed === bed && overlaps(item.start, item.end, start, end))
    if (hold) return { label: hold.reason, hold: true }
    return null
  })()

  const submit = () => {
    if (!bed || !start || conflict) return
    moveBooking(booking.id, bed, start)
    notify({
      title: 'Booking moved',
      description: `${booking.guestName} · ${bedRoom(bed).name} · ${bedLabel(bed)} · from ${fmtDate(start)}.`,
    })
    onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Move booking"
      subtitle={`${booking.guestName} · ${booking.id} · ${duration} ${duration === 1 ? 'night' : 'nights'}`}
      width={460}
      footer={
        <div className="flex items-center justify-end gap-2">
          <ActionButton variant="secondary" onClick={onClose}>Cancel</ActionButton>
          <ActionButton onClick={submit} disabled={!bed || !start || Boolean(conflict)}>Move booking</ActionButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <Callout tone="info" title="Currently">
          {bedRoom(booking.bed).name} · {bedLabel(booking.bed)} · {fmtDate(booking.start)} → {fmtDate(booking.end)}
        </Callout>

        <Field label="New bed" htmlFor="move-bed">
          <Select id="move-bed" value={bed} onChange={(event) => setBed(event.target.value)}>
            {beds.map((item) => (
              <option key={item} value={item}>{bedRoom(item).name} · {bedLabel(item)}</option>
            ))}
          </Select>
        </Field>

        <Field
          label="New check-in"
          htmlFor="move-start"
          hint={`Keeps ${duration} ${duration === 1 ? 'night' : 'nights'}: ${fmtDate(start)} → ${fmtDate(end)}.`}
        >
          <Input id="move-start" type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </Field>

        {conflict ? (
          <Callout tone="danger" title="That bed is not free">
            {conflict.hold
              ? `${conflict.label} — bed on hold for these dates.`
              : `${conflict.label} already occupies this bed for these dates.`}
          </Callout>
        ) : null}
      </div>
    </Modal>
  )
}