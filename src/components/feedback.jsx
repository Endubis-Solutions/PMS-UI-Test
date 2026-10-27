import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react'
import { cx } from './ui'

const MONEY_SIZE = {
  sm: 'text-[12px]',
  body: 'text-[14px]',
  lg: 'text-[20px]',
  stat: 'text-stat',
}

export function Money({ amount, currency, className, signed = false, size = 'body', code = true }) {
  const negative = amount < 0
  const sign = signed ? (negative ? '\u2212' : '+') : negative ? '\u2212' : ''
  return (
    <span className={cx('tnum whitespace-nowrap', MONEY_SIZE[size], className)}>
      {code ? (
        <span className={cx('mr-1 font-medium text-muted', size === 'stat' ? 'text-[14px]' : 'text-[0.8em]')}>
          {currency}
        </span>
      ) : null}
      {sign}
      {Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}
    </span>
  )
}

const BADGE_TONES = {
  neutral: 'border border-line bg-page text-ink',
  primary: 'border border-transparent bg-tint text-primary',
  success: 'border border-line bg-card text-ink',
  warning: 'border border-line bg-card text-ink',
  danger: 'border border-danger/30 bg-danger/5 text-danger',
  blocked: 'border border-line bg-card text-muted',
}

const DOT_TONES = {
  neutral: 'bg-blocked',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  blocked: 'bg-blocked',
}

export function Badge({ children, tone = 'neutral', dot = false, icon: Icon, className }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium leading-4',
        BADGE_TONES[tone],
        className,
      )}
    >
      {dot ? <span className={cx('h-1.5 w-1.5 rounded-full', DOT_TONES[tone])} aria-hidden="true" /> : null}
      {Icon ? <Icon className="h-3 w-3" strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  )
}

export function Spinner({ className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cx('inline-block h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary', className)}
    />
  )
}

export function Skeleton({ className, variant = 'line' }) {
  const variants = {
    line: 'h-3 rounded-[3px]',
    block: 'rounded-control',
    circle: 'rounded-full',
  }
  return <span aria-hidden="true" className={cx('block bg-line/80', variants[variant], className)} />
}

export function SkeletonRows({ rows = 5, columns = 6 }) {
  return (
    <div className="divide-y divide-line" aria-hidden="true">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: columns }).map((__, cellIndex) => (
            <Skeleton
              key={cellIndex}
              className={cx(cellIndex === 0 ? 'w-40' : 'w-20', cellIndex === 1 && 'w-24')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action, className, compact = false }) {
  return (
    <div className={cx('flex flex-col items-center justify-center text-center', compact ? 'px-6 py-8' : 'px-6 py-14', className)}>
      {Icon ? (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-page text-muted">
          <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        </span>
      ) : null}
      <p className="text-[14px] font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 max-w-[46ch] text-[14px] text-muted">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

const CALLOUT_TONES = {
  info: { wrap: 'border-primary/20 bg-tint', icon: Info, iconClass: 'text-primary' },
  success: { wrap: 'border-success/40 bg-success/10', icon: CheckCircle2, iconClass: 'text-ink' },
  warning: { wrap: 'border-warning/40 bg-warning/10', icon: TriangleAlert, iconClass: 'text-ink' },
  danger: { wrap: 'border-danger/30 bg-danger/5', icon: AlertCircle, iconClass: 'text-danger' },
}

export function Callout({ tone = 'info', title, children, action, className }) {
  const config = CALLOUT_TONES[tone]
  const Icon = config.icon
  return (
    <div className={cx('flex items-start gap-3 rounded-control border px-3 py-2.5', config.wrap, className)}>
      <Icon className={cx('mt-0.5 h-4 w-4 shrink-0', config.iconClass)} strokeWidth={1.75} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        {title ? <p className="text-[13px] font-medium text-ink">{title}</p> : null}
        {children ? <div className={cx('text-[13px] leading-5 text-ink/80', title && 'mt-0.5')}>{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}

export function KeyValue({ label, children, className }) {
  return (
    <div className={cx('flex flex-col gap-1', className)}>
      <dt className="text-label uppercase tracking-[0.08em] text-muted">{label}</dt>
      <dd className="text-[14px] text-ink">{children}</dd>
    </div>
  )
}

export function Avatar({ initials, size = 'md', className }) {
  const sizes = { sm: 'h-7 w-7 text-[10px]', md: 'h-9 w-9 text-[11px]', lg: 'h-12 w-12 text-[14px]' }
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-tint font-semibold text-primary',
        sizes[size],
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </span>
  )
}
