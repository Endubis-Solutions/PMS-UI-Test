import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, CalendarDays, Plus } from 'lucide-react'
import { TODAY, roomsFor } from '../data/core'
import { addDays, datesFrom, diffDays, fmtDate, overlaps } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card } from '../components/ui'
import { EmptyState, Skeleton, Badge } from '../components/feedback'
import { TimelineGrid } from '../components/timeline-grid'
import { DAY_W } from '../components/timeline-parts'
import { PillTooltip } from '../components/pill-tooltip'
import { BookingDrawer } from '../components/booking-drawer'
import { CheckInModal } from '../components/checkin-modal'
import { MoveBookingModal } from '../components/move-booking'
import { CalendarHeader, DragBar } from './calendar-toolbar'
import { useCalendarDemoState } from './calendar-effects'
import { useCalendarDrag } from './use-calendar-drag'

const RANGE_START = addDays(TODAY, -365)
const RANGE_DAYS = 731

export default function Calendar() {
  const { hostelId, hostelBookings, hostelHolds, moveBooking, notify } = useApp()
  const { query } = useRoute()
  const overlayOpen = Boolean(query.booking || query.checkin)
  const state = overlayOpen ? 'default' : query.state ?? 'default'
  const [roomFilter, setRoomFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [hover, setHover] = useState(null)
  const [retried, setRetried] = useState(false)
  const [selectedDate, setSelectedDate] = useState(query.date ?? TODAY)
  const [moveId, setMoveId] = useState(null)

  const start = RANGE_START
  const dates = useMemo(() => datesFrom(RANGE_START, RANGE_DAYS), [])
  const rangeEnd = addDays(dates[dates.length - 1], 1)
  const loading = state === 'loading'
  const failed = state === 'error' && !retried

  const bookings = useMemo(() => {
    if (state === 'empty') return []
    return hostelBookings.filter(
      (booking) =>
        (sourceFilter === 'all' || booking.source === sourceFilter) &&
        overlaps(booking.start, booking.end, start, rangeEnd),
    )
  }, [hostelBookings, sourceFilter, start, rangeEnd, state])

  const holds = useMemo(() => {
    if (state === 'empty') return []
    return hostelHolds.filter((hold) => overlaps(hold.start, hold.end, start, rangeEnd))
  }, [hostelHolds, start, rangeEnd, state])

  const rooms = roomFilter === 'all' ? undefined : roomsFor(hostelId).filter((room) => room.id === roomFilter)
  const drag = useCalendarDrag({ bookings: hostelBookings, holds: hostelHolds, moveBooking, notify })

  useCalendarDemoState(state, hostelBookings, {
    notify,
    setDrag: drag.setDrag,
    setDropTarget: drag.setDropTarget,
    setHover,
  })

  const scrollToDate = (date) => {
    const scroller = document.querySelector('[data-timeline-scroll]')
    if (!scroller) return
    const index = diffDays(RANGE_START, date)
    const viewport = scroller.clientWidth || 900
    scroller.scrollLeft = Math.max(0, index * DAY_W - (viewport - DAY_W) / 2)
  }

  const selectDate = (date) => {
    if (!date) return
    setSelectedDate(date)
    scrollToDate(date)
  }

  useEffect(() => {
    const id = window.setTimeout(() => scrollToDate(selectedDate), 60)
    return () => window.clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <CalendarHeader
        selectedDate={selectedDate}
        onSelectDate={selectDate}
        hostelId={hostelId}
        roomFilter={roomFilter}
        setRoomFilter={setRoomFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        count={bookings.length}
        onToday={() => selectDate(TODAY)}
      />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-ink">30-day view</span>
            <span className="text-[11px] text-muted">
              {fmtDate(selectedDate)} selected · scroll to any date
            </span>
            {state === 'group' ? <Badge tone="primary">Group · Kigali FC U19</Badge> : null}
          </div>
          <p className="text-[11px] text-muted">Click to open a stay. Use “Move bed” in the details.</p>
        </div>

        <DragBar drag={drag.drag} duration={drag.duration} dropTarget={drag.dropTarget} onCancel={drag.cancel} />

        {failed ? (
          <EmptyState
            icon={AlertCircle}
            title="Couldn’t load the calendar"
            description="Beds and stays could not be fetched. Nothing has been changed."
            action={<ActionButton variant="secondary" onClick={() => setRetried(true)}>Try again</ActionButton>}
          />
        ) : loading ? (
          <div className="flex flex-col gap-2 p-4">
            <Skeleton className="h-10 w-full" />
            {Array.from({ length: 9 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : bookings.length === 0 && holds.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="No stays in these dates"
            description="Nothing is booked in this range. Walk-ins can be added now."
            action={<ActionButton icon={Plus} onClick={() => navigate('/new-booking')}>New booking</ActionButton>}
          />
        ) : (
          <div>
            <TimelineGrid
              dates={dates}
              onScroll={() => setHover(null)}
              start={start}
              today={TODAY}
              selected={selectedDate}
              hostelId={hostelId}
              bookings={bookings}
              holds={holds}
              rooms={rooms}
              onOpen={(booking) => navigate(`/calendar?booking=${booking.id}`)}
              onHover={setHover}
              onLeave={() => setHover(null)}
              drag={drag.drag}
              dropTarget={drag.dropTarget}
              onDragStart={drag.onDragStart}
              onDragEnd={drag.cancel}
              onCellDragOver={drag.onDragOver}
              onCellDrop={drag.onDrop}
              highlightGroup={state === 'group' ? 'G-77' : null}
              highlightHold={state === 'hold' ? 'H-31' : null}
            />
          </div>
        )}
      </Card>


      <PillTooltip hover={hover} bookings={hostelBookings} holds={hostelHolds} />

      <BookingDrawer
        bookingId={query.booking}
        initialTab={query.tab}
        onClose={() => navigate('/calendar')}
        onCheckIn={(id) => navigate(`/calendar?checkin=${id}`)}
        onOpenFolio={(id) => navigate(`/folio/${id}`)}
        onMove={(booking) => setMoveId(booking.id)}
      />

      <CheckInModal bookingId={query.checkin} onClose={() => navigate('/calendar')} />

      <MoveBookingModal bookingId={moveId} onClose={() => setMoveId(null)} />
    </div>
  )
}
