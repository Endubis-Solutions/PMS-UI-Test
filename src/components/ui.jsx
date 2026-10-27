import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}

const BUTTON_BASE =
  'inline-flex select-none items-center justify-center gap-2 rounded-control font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-55'

const BUTTON_SIZE = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-9 px-4 text-[14px]',
  lg: 'h-10 px-5 text-[14px]',
}

const BUTTON_VARIANT = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'border border-line bg-card text-ink hover:bg-page',
  ghost: 'text-muted hover:bg-page hover:text-ink',
  tint: 'bg-tint text-primary hover:bg-primary/10',
  danger: 'border border-line bg-card text-danger hover:bg-danger/5',
  dangerSolid: 'bg-danger text-white hover:bg-danger/90',
}

export const ActionButton = forwardRef(function ActionButton(
  { variant = 'primary', size = 'md', icon: Icon, loading = false, children, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cx(BUTTON_BASE, BUTTON_SIZE[size], BUTTON_VARIANT[variant], className)}
      disabled={loading || props.disabled}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden="true" />
      ) : Icon ? (
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  )
})

export function IconButton({ icon: Icon, label, className, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex h-9 w-9 items-center justify-center rounded-control text-muted transition-colors duration-150 hover:bg-page hover:text-ink',
        className,
      )}
      {...props}
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}

export function IconBadge({ icon: Icon, tone = 'primary', size = 'md' }) {
  const tones = {
    primary: 'bg-tint text-primary',
    danger: 'bg-danger/10 text-danger',
    muted: 'bg-page text-muted',
  }
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }
  const iconSizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }
  return (
    <span className={cx('inline-flex shrink-0 items-center justify-center rounded-full', tones[tone], sizes[size])}>
      <Icon className={iconSizes[size]} strokeWidth={1.75} aria-hidden="true" />
    </span>
  )
}

export function PageHeader({ icon: Icon, title, subtitle, actions }) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon ? (
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint text-primary">
            <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <h1 className="text-title text-ink">{title}</h1>
          {subtitle ? <p className="mt-1 max-w-[68ch] text-body text-muted">{subtitle}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  )
}

export function Card({ className, children, as: Tag = 'section', ...props }) {
  return (
    <Tag className={cx('rounded-card border border-line bg-card', className)} {...props}>
      {children}
    </Tag>
  )
}

export function SectionTitle({ children, action, hint, className }) {
  return (
    <div className={cx('flex flex-wrap items-baseline justify-between gap-2', className)}>
      <div className="flex items-baseline gap-2">
        <h2 className="text-[14px] font-semibold text-ink">{children}</h2>
        {hint ? <span className="text-[11px] text-muted">{hint}</span> : null}
      </div>
      {action}
    </div>
  )
}
