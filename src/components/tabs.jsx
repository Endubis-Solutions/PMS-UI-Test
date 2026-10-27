import { cx } from './ui'

export function SegmentedControl({ items, value, onChange, size = 'md', className }) {
  return (
    <div
      className={cx('inline-flex items-center rounded-control border border-line bg-card p-0.5', className)}
      role="group"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={value === item.id}
          onClick={() => onChange(item.id)}
          className={cx(
            'rounded-[6px] font-medium transition-colors duration-150',
            size === 'sm' ? 'h-7 px-2.5 text-[12px]' : 'h-8 px-3 text-[13px]',
            value === item.id ? 'bg-tint text-primary' : 'text-muted hover:text-ink',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

export function Tabs({ tabs, value, onChange, className, children }) {
  return (
    <div className={className}>
      <div role="tablist" className="flex items-center gap-6 border-b border-line">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={value === tab.id}
            onClick={() => onChange(tab.id)}
            className={cx(
              '-mb-px flex h-11 items-center gap-1.5 border-b-2 text-[14px] transition-colors duration-150',
              value === tab.id
                ? 'border-primary font-medium text-primary'
                : 'border-transparent text-muted hover:text-ink',
            )}
          >
            {tab.label}
            {tab.count != null ? <span className="tnum text-[11px] text-muted">{tab.count}</span> : null}
          </button>
        ))}
      </div>
      {children}
    </div>
  )
}

export function Stepper({ steps, current, onStep }) {
  return (
    <ol className="flex flex-wrap items-center gap-x-2 gap-y-3">
      {steps.map((step, index) => {
        const done = index < current
        const active = index === current
        return (
          <li key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => done && onStep(index)}
              disabled={!done}
              className={cx('flex items-center gap-2 rounded-control text-left', done ? 'cursor-pointer' : 'cursor-default')}
            >
              <span
                className={cx(
                  'tnum flex h-6 w-6 items-center justify-center rounded-full border text-[11px] font-medium',
                  active && 'border-primary bg-primary text-white',
                  done && 'border-primary bg-tint text-primary',
                  !active && !done && 'border-line bg-card text-muted',
                )}
              >
                {index + 1}
              </span>
              <span className={cx('text-[13px]', active || done ? 'text-ink' : 'text-muted', active && 'font-medium')}>
                {step.label}
              </span>
            </button>
            {index < steps.length - 1 ? <span className="h-px w-8 bg-line" aria-hidden="true" /> : null}
          </li>
        )
      })}
    </ol>
  )
}
