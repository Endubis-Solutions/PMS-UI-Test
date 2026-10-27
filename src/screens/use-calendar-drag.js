import { useState } from 'react'
import { bedLabel } from '../data/core'
import { addDays, fmtDate, nights, overlaps } from '../lib/format'

export function useCalendarDrag({ bookings, holds, moveBooking, notify }) {
  const [drag, setDrag] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const duration = drag ? Math.max(1, nights(drag.start, drag.end)) : 0

  const conflictFor = (bed, date) => {
    if (!drag) return null
    const end = addDays(date, duration)
    const hit = bookings.find(
      (item) => item.bed === bed && item.id !== drag.id && overlaps(item.start, item.end, date, end),
    )
    if (hit) return { start: hit.start, end: hit.end, hold: false }
    const hold = holds.find((item) => item.bed === bed && overlaps(item.start, item.end, date, end))
    if (hold) return { start: hold.start, end: hold.end, hold: true }
    return null
  }

  const onDragStart = (booking) => {
    setDrag(booking)
    setDropTarget(null)
  }

  const onDragOver = (bed, date) => {
    if (!drag) return
    setDropTarget((current) => {
      if (current && current.bed === bed && current.date === date) return current
      const conflict = conflictFor(bed, date)
      return { bed, date, valid: !conflict, conflict }
    })
  }

  const onDrop = (bed, date) => {
    if (!drag) return
    const conflict = conflictFor(bed, date)
    if (conflict) {
      notify({
        tone: 'danger',
        title: 'That bed is not free',
        description: `${conflict.hold ? 'Bed on hold' : 'Bed already booked'} ${fmtDate(conflict.start)}–${fmtDate(conflict.end)}.`,
      })
    } else {
      moveBooking(drag.id, bed, date)
      notify({
        title: 'Booking moved',
        description: `${drag.guestName} now occupies ${bedLabel(bed)} from ${fmtDate(date)}.`,
      })
    }
    setDrag(null)
    setDropTarget(null)
  }

  const cancel = () => {
    setDrag(null)
    setDropTarget(null)
  }

  return { drag, dropTarget, duration, setDrag, setDropTarget, onDragStart, onDragOver, onDrop, cancel }
}
