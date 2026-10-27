import { AlertCircle, CalendarDays, Move, Plus, X } from 'lucide-react'
import { SOURCES, SOURCE_ORDER, roomLabel, roomsFor } from '../data/core'
import { fmtDate, fmtLong } from '../lib/format'
import { navigate } from '../lib/router'
import { ActionButton, PageHeader } from '../components/ui'
import { Field, Select } from '../components/form'
import { FilterBar } from '../components/table'
import { TimelineLegend } from '../components/timeline-parts'

export function CalendarHeader({ selectedDate, onSelectDate, hostelId, roomFilter, setRoomFilter, sourceFilter, setSourceFilter, count, onToday }) {
  const activeCount = (roomFilter !== 'all' ? 1 : 0) + (sourceFilter !== 'all' ? 1 : 0)
  return (
    <>
      <PageHeader
        icon={CalendarDays}
        title="Calendar"
        subtitle={`${fmtLong(selectedDate)} · ${count} stays · scroll to any date past or future.`}
        actions={
          <>
            <label className="flex h-9 items-center gap-2 rounded-control border border-line bg-card px-2.5 text-[13px] text-ink transition-colors hover:border-blocked focus-within:border-primary">
              <CalendarDays className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => onSelectDate(event.target.value)}
                aria-label="Jump to date"
                className="bg-transparent text-[13px] text-ink outline-none"
              />
            </label>
            <ActionButton variant="secondary" onClick={onToday}>
              Today
            </ActionButton>
            <ActionButton icon={Plus} onClick={() => navigate('/new-booking')}>
              New booking
            </ActionButton>
          </>
        }
      />
      <FilterBar
        activeCount={activeCount}
        onClear={() => {
          setRoomFilter('all')
          setSourceFilter('all')
        }}
        resultCount={count}
        resultLabel="stays"
      >
        <div className="w-[210px]">
          <Field label="Room" htmlFor="room-filter">
            <Select id="room-filter" value={roomFilter} onChange={(event) => setRoomFilter(event.target.value)}>
              <option value="all">All rooms</option>
              {roomsFor(hostelId).map((room) => (
                <option key={room.id} value={room.id}>{roomLabel(room)}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="w-[180px]">
          <Field label="Source" htmlFor="source-filter">
            <Select id="source-filter" value={sourceFilter} onChange={(event) => setSourceFilter(event.target.value)}>
              <option value="all">All sources</option>
              {SOURCE_ORDER.map((source) => (
                <option key={source} value={source}>{SOURCES[source].label}</option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="ml-auto hidden pb-1.5 xl:block">
          <TimelineLegend />
        </div>
      </FilterBar>
    </>
  )
}

export function DragBar({ drag, duration, dropTarget, onCancel }) {
  if (!drag) return null
  const conflict = dropTarget?.conflict
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-line bg-tint px-4 py-2">
      <Move className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
      <p className="text-[12px] text-ink">
        Moving <span className="font-medium">{drag.guestName}</span> · {duration} nights. Drop on a free bed.
      </p>
      {dropTarget && !dropTarget.valid ? (
        <span className="ml-auto inline-flex items-center gap-1.5 rounded-[6px] border border-danger/30 bg-card px-2 py-1 text-[11px] font-medium text-danger">
          <AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
          {conflict?.hold ? 'Bed on hold' : 'Bed already booked'}{' '}
          {fmtDate(conflict?.start ?? dropTarget.date)}–{fmtDate(conflict?.end ?? dropTarget.date)}
        </span>
      ) : dropTarget?.valid ? (
        <span className="ml-auto text-[11px] font-medium text-ink">Release to move here</span>
      ) : null}
      <button
        type="button"
        onClick={onCancel}
        aria-label="Cancel move"
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-[6px] text-muted hover:bg-card hover:text-ink"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}
