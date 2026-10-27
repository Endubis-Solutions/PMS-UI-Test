export function TypeSheet() {
  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="text-[16px] font-semibold text-ink">Type</h2>
        <p className="mt-1 max-w-[70ch] text-[13px] text-muted">
          Inter, self-hosted. Four roles only: title, stat, body and section label.
        </p>
        <div className="mt-4 divide-y divide-line rounded-control border border-line bg-card">
          <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
            <p className="text-title text-ink">Bed timeline</p>
            <span className="tnum text-[11px] text-muted">page title · 24 / 600</span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
            <p className="text-stat font-bold text-ink">13 / 16</p>
            <span className="tnum text-[11px] text-muted">stat · 36 / 700 · tabular</span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
            <p className="text-body text-ink">42 stays · 5 arrivals · every amount with its currency code.</p>
            <span className="tnum text-[11px] text-muted">body and table · 14 / 400</span>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-3 p-4">
            <p className="text-label uppercase tracking-[0.08em] text-muted">Occupancy</p>
            <span className="tnum text-[11px] text-muted">label · 11 / 500 · 0.08em</span>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[16px] font-semibold text-ink">Shape, spacing, focus</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-control border border-line bg-card p-4">
            <div className="h-8 rounded-control bg-tint" />
            <p className="mt-2 text-[12px] text-ink">8 px · controls and pills</p>
          </div>
          <div className="rounded-card border border-line bg-card p-4">
            <div className="h-8 rounded-card bg-tint" />
            <p className="mt-2 text-[12px] text-ink">12 px · cards</p>
          </div>
          <div className="rounded-control border border-line bg-card p-4">
            <button type="button" className="h-8 rounded-control border-2 border-primary bg-card px-3 text-[12px] text-ink">
              Focus ring
            </button>
            <p className="mt-2 text-[12px] text-ink">2 px · primary, 2 px offset</p>
          </div>
          <div className="rounded-control border border-line bg-card p-4">
            <div className="flex items-end gap-1">
              {[4, 8, 12, 16, 24, 32].map((size) => (
                <span key={size} className="h-3 bg-tint" style={{ width: size }} aria-hidden="true" />
              ))}
            </div>
            <p className="mt-2 text-[12px] text-ink">4 px grid · 4/8/12/16/24/32</p>
          </div>
        </div>
      </section>
    </div>
  )
}
