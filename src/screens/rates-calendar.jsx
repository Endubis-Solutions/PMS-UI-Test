import { useState } from 'react'
import { fmtDate, fmtDay, parseISO } from '../lib/format'
import { cx } from '../components/ui'
import { Skeleton } from '../components/feedback'

export function RateCalendar({ dates, rooms, prices, setPrices, roomState, onToggleRoom, loading }) {
  const [editing, setEditing] = useState(null)
  if (loading) {
    return (
      <div className="flex flex-col gap-2 p-4">
        {[0, 1, 2].map((key) => (
          <Skeleton key={key} className="h-9 w-full" />
        ))}
      </div>
    )
  }

  const valueFor = (roomId, key, date) => {
    const value = prices[`${roomId}|${date}`]
    return typeof value === 'object' ? value[key] : value
  }

  const commit = (roomId, key, date, value) => {
    const k = `${roomId}|${date}`
    const number = Number(value) || 0
    setPrices((current) => {
      const next = { ...current }
      next[k] = typeof current[k] === 'object' ? { ...current[k], [key]: number } : number
      return next
    })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left" style={{ minWidth: 960 }}>
        <thead>
          <tr>
            <th
              className="sticky left-0 z-10 border-b border-r border-line bg-card px-4 py-2 text-label uppercase tracking-[0.08em] text-muted"
              style={{ width: 240 }}
            >
              Room · availability
            </th>
            <th className="border-b border-line px-2 py-2 text-label uppercase tracking-[0.08em] text-muted" style={{ width: 96 }}>
              Rate
            </th>
            {dates.map((date) => {
              const weekend = [0, 6].includes(parseISO(date).getDay())
              return (
                <th
                  key={date}
                  className={cx(
                    'border-b border-l border-line px-1 py-1.5 text-center text-[10px] font-normal',
                    weekend ? 'bg-page text-muted' : 'bg-card text-muted',
                    date === '2026-09-17' && 'bg-tint text-primary',
                  )}
                >
                  <span className="block uppercase tracking-[0.06em]">{fmtDay(date)}</span>
                  <span className="tnum block text-[11px] text-ink">{fmtDate(date)}</span>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const closed = roomState[room.id] === 'closed'
            const variants = room.type === 'double'
              ? [{ key: 'pax1', label: '1 person' }, { key: 'pax2', label: '2 people' }]
              : [{ key: 'pax1', label: 'per person' }]
            return variants.map((variant, index) => (
              <tr key={`${room.id}-${variant.key}`} className={cx('border-b border-line last:border-0', closed && 'opacity-50')}>
                {index === 0 ? (
                  <td rowSpan={variants.length} className="sticky left-0 z-10 border-r border-line bg-card px-4 py-2 align-top">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-ink">{room.name}</p>
                        <p className="text-[11px] text-muted">{room.typeName}</p>
                      </div>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={!closed}
                        aria-label={`${closed ? 'Open' : 'Close'} ${room.name}`}
                        onClick={() => onToggleRoom(room.id)}
                        className={cx(
                          'relative h-5 w-9 shrink-0 rounded-full border transition-colors duration-150',
                          !closed ? 'border-primary bg-primary' : 'border-line bg-page',
                        )}
                      >
                        <span
                          className={cx(
                            'absolute top-0.5 h-3.5 w-3.5 rounded-full bg-card shadow-card transition-all duration-150',
                            !closed ? 'left-[18px]' : 'left-0.5',
                          )}
                        />
                      </button>
                    </div>
                    <p className={cx('mt-1 text-[11px]', closed ? 'text-danger' : 'text-muted')}>
                      {closed ? 'Closed' : 'Open'}
                    </p>
                  </td>
                ) : null}
                <td className="border-l border-line px-2 py-2 text-[12px] text-muted">{variant.label}</td>
                {dates.map((date) => {
                  const editKey = `${room.id}|${date}|${variant.key}`
                  const active = editing === editKey
                  const weekend = [0, 6].includes(parseISO(date).getDay())
                  return (
                    <td key={date} className={cx('border-l border-line p-0', weekend && 'bg-page')}>
                      {active ? (
                        <input
                          autoFocus
                          type="number"
                          defaultValue={valueFor(room.id, variant.key, date)}
                          onBlur={(event) => {
                            commit(room.id, variant.key, date, event.target.value)
                            setEditing(null)
                          }}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') event.currentTarget.blur()
                            if (event.key === 'Escape') setEditing(null)
                          }}
                          aria-label={`${variant.label} rate for ${room.name} on ${fmtDate(date)}`}
                          className="h-9 w-full bg-card px-2 text-right text-[12px] tabular-nums text-ink outline-none ring-2 ring-inset ring-primary"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => setEditing(editKey)}
                          className="tnum h-9 w-full px-2 text-right text-[12px] text-ink transition-colors hover:bg-tint"
                        >
                          {valueFor(room.id, variant.key, date)?.toLocaleString('en-US')}
                        </button>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))
          })}
        </tbody>
      </table>
    </div>
  )
}
