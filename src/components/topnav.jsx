import {
  CalendarDays,
  ChevronDown,
  LayoutDashboard,
  Receipt,
  Users,
} from 'lucide-react'
import { CURRENCIES } from '../data/core'
import { useApp } from '../lib/store'
import { Link, useRoute } from '../lib/router'
import { PropertyChip } from './property'
import { NotificationsMenu } from './notifications'
import { OverflowMenu } from './overflow'
import { cx } from './ui'

const PRIMARY_NAV = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/calendar', label: 'Calendar' },
  { to: '/guests', label: 'Guests' },
  { to: '/finance-entry', label: 'Finance entry' },
]

export function TopNav() {
  const { user, currency, setCurrency, isAdmin } = useApp()
  const { pathname } = useRoute()

  return (
    <header className="sticky top-0 z-40 bg-card">
      <div className="h-16 border-b border-line">
        <div className="mx-auto flex h-full max-w-[1440px] items-center gap-3 px-6">
          <Link to="/dashboard" className="flex shrink-0 items-center gap-2.5" aria-label="Mad Vervet PMS home">
            <img src="/logo.jpg" alt="Mad Vervet" className="h-8 w-8 rounded-[8px] object-cover" />
            <span className="hidden flex-col leading-none sm:flex">
              <span className="text-[14px] font-semibold text-ink">Mad Vervet</span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">Hostel PMS</span>
            </span>
          </Link>

          <span className="mx-1 hidden h-6 w-px bg-line lg:block" aria-hidden="true" />

          <PropertyChip locked={!isAdmin} />

          <div className="relative hidden md:block">
            <label htmlFor="currency" className="sr-only">
              Currency for new payments
            </label>
            <select
              id="currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              title="Default currency for new payments. Amounts are never converted."
              className="h-9 cursor-pointer appearance-none rounded-control border border-line bg-card pl-2.5 pr-7 text-[13px] font-medium text-ink outline-none transition-colors hover:border-blocked focus:border-primary"
            >
              {CURRENCIES.map((item) => (
                <option key={item.code} value={item.code}>
                  {item.code}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>

          <nav aria-label="Primary" className="ml-auto flex h-16 items-center gap-0.5 overflow-x-auto no-scrollbar">
            {PRIMARY_NAV.map((item) => {
              const active = pathname === item.to
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'relative flex h-16 shrink-0 items-center gap-1.5 px-3 text-[13px] transition-colors duration-150',
                    active
                      ? 'font-medium text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-[2px] after:bg-primary'
                      : 'text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <NotificationsMenu />

          <OverflowMenu />

          <div className="hidden shrink-0 items-center gap-2 border-l border-line pl-3 2xl:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-tint text-[11px] font-semibold text-primary">
              {user?.initials}
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[12px] font-medium text-ink">{user?.name}</span>
              <span className="mt-1 text-[10px] uppercase tracking-[0.08em] text-muted">{user?.title}</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
