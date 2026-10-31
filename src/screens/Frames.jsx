import { ArrowRight, Compass } from 'lucide-react'
import { Link, navigate } from '../lib/router'
import { useApp } from '../lib/store'
import { ActionButton, Card, PageHeader } from '../components/ui'
import { FRAMES, JOURNEYS } from './frames-data'

function FrameLink({ path, state, label }) {
  const target = state.startsWith('&') ? `${path}${state}` : `${path}${path.includes('?') ? '&' : '?'}state=${state}`
  return (
    <Link
      to={target}
      aria-label={label}
      className="inline-flex h-7 items-center rounded-full border border-line bg-card px-2.5 text-[11px] text-ink transition-colors hover:border-primary hover:text-primary"
    >
      {label.replace(/^[^:]+:\s*/, '')}
    </Link>
  )
}

export default function Frames() {
  const { user } = useApp()

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-card">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-6">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Mad Vervet" className="h-8 w-8 rounded-[8px] object-cover" />
            <span className="flex flex-col leading-none">
              <span className="text-[14px] font-semibold text-ink">Mad Vervet</span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.12em] text-muted">Design frames</span>
            </span>
          </Link>
          <ActionButton variant="secondary" onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Back to app' : 'Sign in'}
          </ActionButton>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-8">
        <PageHeader
          icon={Compass}
          title="Frame index"
          subtitle="Every screen and state in the prototype, each at 1440×900. Open a frame, then use the top bar to switch property."
          actions={
            <ActionButton variant="secondary" onClick={() => navigate('/styleguide')}>
              Tokens & components
            </ActionButton>
          }
        />

        <Card className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-page">
                <th className="w-[80px] px-5 py-2.5 text-label uppercase tracking-[0.08em] text-muted">Screen</th>
                <th className="w-[220px] px-3 py-2.5 text-label uppercase tracking-[0.08em] text-muted">Name</th>
                <th className="px-3 py-2.5 text-label uppercase tracking-[0.08em] text-muted">States</th>
              </tr>
            </thead>
            <tbody>
              {FRAMES.map((frame) => (
                <tr key={frame.id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 align-top text-[12px] font-medium text-muted">{frame.id}</td>
                  <td className="px-3 py-3 align-top">
                    <Link to={frame.path} className="text-[13px] font-medium text-ink hover:text-primary">
                      {frame.title}
                    </Link>
                    <p className="mt-0.5 text-[10px] text-muted">{frame.path}</p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {frame.states.map(([state, label]) => (
                        <FrameLink key={`${frame.id}-${state}`} path={frame.path} state={state} label={`${frame.title}: ${label}`} />
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="text-[16px] font-semibold text-ink">Journeys</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {JOURNEYS.map((journey) => (
              <Card key={journey.id} className="flex items-start justify-between gap-4 p-5">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.08em] text-muted">Journey {journey.id}</p>
                  <p className="mt-1 text-[14px] font-semibold text-ink">{journey.title}</p>
                  <p className="mt-1 max-w-[48ch] text-[12px] leading-5 text-muted">{journey.detail}</p>
                </div>
                <ActionButton variant="secondary" size="sm" onClick={() => navigate(journey.start)}>
                  Start <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </ActionButton>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-card border border-line bg-card p-5">
          <h2 className="text-[14px] font-semibold text-ink">Verify</h2>
          <ul className="mt-2 grid gap-1.5 text-[12px] text-muted md:grid-cols-2">
            <li>Every screen and listed state is reachable above.</li>
            <li>Every colour comes from the Tokens block; no other hex value exists in the app.</li>
            <li>Body and placeholder text meet 4.5:1; status is never colour alone.</li>
            <li>The hostel chip sits on every screen, including login.</li>
            <li>All four journeys run end to end with no dead ends.</li>
            <li>Static mock data only; no network calls, no persistence.</li>
          </ul>
        </section>
      </main>
    </div>
  )
}
