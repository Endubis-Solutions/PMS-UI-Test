import { Link } from '../lib/router'
import { TODAY } from '../data/core'
import { PropertyChip } from '../components/property'
import { fmtLong } from '../lib/format'
import LoginCard from './login-card'

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col bg-page">
      <div className="border-b border-line bg-card">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6">
          <Link to="/login" className="flex items-center gap-2.5" aria-label="Mad Vervet PMS">
            <img src="/logo.jpg" alt="Mad Vervet" className="h-8 w-8 rounded-[8px] object-cover" />
            <span className="flex flex-col leading-none">
              <span className="text-[14px] font-semibold text-ink">Mad Vervet</span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">Hostel PMS</span>
            </span>
          </Link>
          <PropertyChip readOnly />
        </div>
      </div>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <h1 className="text-title text-ink">Sign in</h1>
          <p className="mt-1 text-body text-muted">Staff and admin access to the property you are assigned to.</p>
          <LoginCard />
          <p className="mt-4 text-[11px] leading-4 text-muted">
            Today is {fmtLong(TODAY)}. Financial data stays inside the selected property and is never
            converted between currencies.
          </p>
        </div>
      </main>

      <footer className="border-t border-line px-6 py-4">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
          <span>Mad Vervet Hostel · PMS v3.0 · Static prototype, no live data</span>
          <Link to="/frames" className="font-medium text-primary hover:text-primary-hover">
            Design frames
          </Link>
        </div>
      </footer>
    </div>
  )
}
