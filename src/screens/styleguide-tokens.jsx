import { SOURCES, SOURCE_ORDER } from '../data/core'

const COLORS = [
  ['primary', '#2563EB', 'Active nav, primary action, today'],
  ['primary hover', '#1D4ED8', 'Primary button hover'],
  ['primary tint', '#EFF6FF', 'Icon badge, selected state'],
  ['page', '#F8FAFC', 'Page background'],
  ['card', '#FFFFFF', 'Cards, tables, nav'],
  ['border', '#E5E7EB', 'Card and row borders'],
  ['text', '#111827', 'Headings and key values'],
  ['secondary text', '#6B7280', 'Subtitles, labels, meta'],
  ['success', '#10B981', 'Availability, paid'],
  ['warning', '#F59E0B', 'Attention, needs action'],
  ['danger', '#DC2626', 'Destructive, validation'],
  ['blocked', '#9CA3AF', 'Hatched blocked cells'],
]

const STATUS = [
  ['reserved', '#38BDF8'],
  ['checked-in', '#34D399'],
  ['checked-out', '#9CA3AF'],
]

export function TokenSheet() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-[16px] font-semibold text-ink">Colour</h2>
        <p className="mt-1 max-w-[70ch] text-[13px] text-muted">
          Twelve interface values, three status fills and seven fixed source colours. Nothing else is used,
          including browser surfaces.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {COLORS.map(([name, hex, use]) => (
            <div key={name} className="flex items-center gap-3 rounded-control border border-line bg-card p-3">
              <span
                className="h-10 w-10 shrink-0 rounded-[6px] border border-line"
                style={{ backgroundColor: hex }}
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[13px] font-medium text-ink">{name}</p>
                <p className="tnum text-[11px] text-muted">{hex}</p>
                <p className="truncate text-[11px] text-muted">{use}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-[16px] font-semibold text-ink">Booking status and source</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-control border border-line bg-card p-4">
            <p className="text-label uppercase tracking-[0.08em] text-muted">Pill fill = status</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STATUS.map(([name, hex]) => (
                <span key={name} className="inline-flex items-center gap-2 rounded-control border border-line px-2 py-1.5">
                  <span className="h-5 w-8 rounded-[4px] border border-ink/10" style={{ backgroundColor: hex }} aria-hidden="true" />
                  <span className="text-[12px] text-ink">{name}</span>
                  <span className="tnum text-[11px] text-muted">{hex}</span>
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted">
              Status is never colour alone: the drawer and legend name it.
            </p>
          </div>
          <div className="rounded-control border border-line bg-card p-4">
            <p className="text-label uppercase tracking-[0.08em] text-muted">Dot = source, fixed once</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {SOURCE_ORDER.map((id) => (
                <span key={id} className="inline-flex items-center gap-1.5 text-[12px] text-ink">
                  <span className={`h-2.5 w-2.5 rounded-full ${SOURCES[id].dot}`} aria-hidden="true" />
                  {SOURCES[id].label}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-muted">
              Source is a dot on pills, dot plus label in tables — never coloured text.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
