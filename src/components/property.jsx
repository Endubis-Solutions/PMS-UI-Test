import { useRef, useState } from 'react'
import { AlertCircle, Building2, Check, ChevronDown, Info, Lock, TriangleAlert } from 'lucide-react'
import { useApp } from '../lib/store'
import { useClickOutside } from '../lib/hooks'
import { cx } from './ui'

export function PropertyChip({ locked = false, readOnly = false }) {
  const { hostel, hostels, switchHostel } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup={!locked && !readOnly ? 'menu' : undefined}
        aria-expanded={!locked && !readOnly ? open : undefined}
        aria-label={locked ? `Property: ${hostel.short}, locked to your account` : `Property: ${hostel.short}`}
        onClick={() => !locked && !readOnly && setOpen((value) => !value)}
        title={locked ? `Locked to ${hostel.short}` : undefined}
        className={cx(
          'flex h-9 items-center gap-2 rounded-control border border-line bg-card pl-2 pr-2.5 text-left transition-colors duration-150',
          locked || readOnly ? 'cursor-default' : 'hover:bg-page',
        )}
      >
        <Building2 className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
        <span className="text-[13px] font-medium text-ink">{hostel.short}</span>
        {locked ? (
          <Lock className="h-3.5 w-3.5 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        ) : readOnly ? null : (
          <ChevronDown className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        )}
      </button>

      {open && !locked && !readOnly ? (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-[268px] animate-fade-in rounded-card border border-line bg-card p-1 shadow-raised"
        >
          {hostels.map((property) => (
            <button
              key={property.id}
              type="button"
              role="menuitemradio"
              aria-checked={property.id === hostel.id}
              onClick={() => {
                switchHostel(property.id)
                setOpen(false)
              }}
              className="flex w-full items-center gap-2 rounded-control px-3 py-2 text-left transition-colors hover:bg-page"
            >
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-ink">{property.short}</span>
                <span className="mt-0.5 block truncate text-[11px] text-muted">
                  {property.address} · {property.currency}
                </span>
              </span>
              {property.id === hostel.id ? (
                <Check className="h-4 w-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
              ) : null}
            </button>
          ))}
          <p className="mt-1 border-t border-line px-3 pb-1 pt-2 text-[11px] leading-4 text-muted">
            Bookings, accounts and reports always belong to the property shown here.
          </p>
        </div>
      ) : null}
    </div>
  )
}

const ALERT_TONES = {
  warning: { wrap: 'border-warning/40 bg-warning/10', Icon: TriangleAlert },
  danger: { wrap: 'border-danger/30 bg-danger/5', Icon: AlertCircle },
  info: { wrap: 'border-primary/20 bg-tint', Icon: Info },
}

export function AlertBanner({ tone = 'warning', title, description, action }) {
  const config = ALERT_TONES[tone] ?? ALERT_TONES.warning
  const Icon = config.Icon
  return (
    <div role="status" className={`border-b ${config.wrap}`}>
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-3 gap-y-2 px-6 py-2.5">
        <Icon className="h-4 w-4 shrink-0 text-ink" strokeWidth={1.75} aria-hidden="true" />
        <p className="text-[13px] leading-5 text-ink">
          {title ? <span className="font-medium">{title}</span> : null}
          {description ? <> {description}</> : null}
        </p>
        {action ? <div className="ml-auto shrink-0">{action}</div> : null}
      </div>
    </div>
  )
}
