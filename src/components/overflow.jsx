import { useRef, useState } from 'react'
import {
  BarChart3,
  BedDouble,
  ExternalLink,
  Globe,
  LogOut,
  MoreHorizontal,
  ShieldCheck,
  Wallet,
} from 'lucide-react'
import { useApp } from '../lib/store'
import { useClickOutside } from '../lib/hooks'
import { navigate } from '../lib/router'
import { cx } from './ui'

const SECONDARY_NAV = [
  { to: '/reports', label: 'Reports', icon: BarChart3, admin: true },
  { to: '/finance', label: 'Admin finance', icon: Wallet, admin: true },
  { to: '/rates', label: 'Pricing', icon: BedDouble },
  { to: '/logs', label: 'Logs', icon: ShieldCheck, admin: true },
  { href: 'https://erp-test-ui.netlify.app/', label: 'ERP', icon: ExternalLink, admin: true },
]

export function OverflowMenu() {
  const { user, hostel, isAdmin, signOut } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const secondary = SECONDARY_NAV.filter((item) => !item.admin || isAdmin)

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-label="More sections"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cx(
          'flex h-9 w-9 items-center justify-center rounded-control transition-colors duration-150',
          open ? 'bg-page text-ink' : 'text-muted hover:bg-page hover:text-ink',
        )}
      >
        <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[280px] animate-fade-in rounded-card border border-line bg-card p-1 shadow-raised"
        >
          <div className="flex items-center gap-2.5 border-b border-line px-3 pb-3 pt-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint text-[11px] font-semibold text-primary">
              {user?.initials}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-ink">{user?.name}</span>
              <span className="block truncate text-[11px] text-muted">
                {isAdmin ? 'Admin' : 'Staff'} · {hostel.short}
              </span>
            </span>
          </div>

          {secondary.map((item) => {
            const Icon = item.icon
            const itemClass =
              'flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-[13px] text-ink transition-colors hover:bg-page'
            if (item.href) {
              return (
                <a
                  key={item.label}
                  role="menuitem"
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setOpen(false)}
                  className={itemClass}
                >
                  <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                </a>
              )
            }
            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false)
                  navigate(item.to)
                }}
                className={itemClass}
              >
                <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{item.label}</span>
              </button>
            )
          })}

          <div className="mt-1 border-t border-line px-3 pb-1 pt-2">
            <label htmlFor="language" className="flex items-center gap-2.5 text-[13px] text-ink">
              <Globe className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
              <span className="flex-1">Language</span>
              <select
                id="language"
                defaultValue="en"
                className="h-7 cursor-pointer rounded-[6px] border border-line bg-card px-1.5 text-[12px] text-ink"
              >
                <option value="en">English</option>
                <option value="am">አማርኛ</option>
                <option value="sw">Kiswahili</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              signOut()
              navigate('/login')
            }}
            className="mt-1 flex w-full items-center gap-2.5 rounded-control px-3 py-2 text-left text-[13px] font-medium text-danger transition-colors hover:bg-danger/5"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            Log out
          </button>
        </div>
      ) : null}
    </div>
  )
}
