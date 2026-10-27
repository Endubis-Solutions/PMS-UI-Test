import { ChevronDown } from 'lucide-react'
import { SOURCES, STATUSES, STATUS_STYLE } from '../data/core'
import { Card, cx } from './ui'

export function SourceBadge({ source, withLabel = false, className }) {
  const item = SOURCES[source] ?? SOURCES.direct
  return (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap', className)}>
      <span className={cx('h-2 w-2 shrink-0 rounded-full', item.dot)} aria-hidden="true" />
      {withLabel ? (
        <span className="text-[12px] text-muted">{item.label}</span>
      ) : (
        <span className="sr-only">{item.label}</span>
      )}
    </span>
  )
}

export function StatusDropdown({ value, onChange, options = STATUSES, label = 'Booking status', className }) {
  return (
    <div className={cx('relative inline-flex', className)}>
      <span
        className={cx(
          'pointer-events-none absolute left-2.5 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full',
          STATUS_STYLE[value]?.dot ?? 'bg-blocked',
        )}
        aria-hidden="true"
      />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 cursor-pointer appearance-none rounded-control border border-line bg-card pl-6 pr-7 text-[13px] text-ink transition-colors hover:border-blocked focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  )
}

export function StatCard({ label, icon: Icon, children, footer, className }) {
  return (
    <Card className={cx('flex flex-col p-6', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-label uppercase tracking-[0.08em] text-muted">{label}</span>
        {Icon ? <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" /> : null}
      </div>
      <div className="mt-3 flex-1">{children}</div>
      {footer ? <div className="mt-4 border-t border-line pt-3">{footer}</div> : null}
    </Card>
  )
}

export function SegmentedCounter({ items, value, onChange, className }) {
  return (
    <div className={cx('flex flex-wrap items-stretch gap-x-7 border-b border-line', className)} role="tablist">
      {items.map((item) => {
        const active = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={cx(
              '-mb-px flex items-baseline gap-2 border-b-2 pb-3 pt-1 transition-colors duration-150',
              active ? 'border-primary' : 'border-transparent hover:border-line',
            )}
          >
            <span className={cx('tnum text-[18px] font-semibold leading-6', active ? 'text-primary' : 'text-ink')}>
              {item.count}
            </span>
            <span className={cx('text-[13px]', active ? 'text-ink' : 'text-muted')}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
