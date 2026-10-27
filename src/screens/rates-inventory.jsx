import { BedDouble } from 'lucide-react'
import { bedLabel, bedRoom } from '../data/core'
import { fmtDate, nights } from '../lib/format'
import { Card, SectionTitle } from '../components/ui'
import { EmptyState } from '../components/feedback'

export function HoldsCard({ holds, onRelease }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-6 py-4">
        <SectionTitle hint={`${holds.length} active`}>Maintenance holds</SectionTitle>
      </div>
      {holds.length ? (
        <ul className="divide-y divide-line border-t border-line">
          {holds.map((hold) => (
            <li key={hold.id} className="flex flex-wrap items-center justify-between gap-2 px-6 py-3">
              <div>
                <p className="text-[13px] font-medium text-ink">
                  {bedRoom(hold.bed).name} · {bedLabel(hold.bed)} · {hold.reason}
                </p>
                <p className="text-[11px] text-muted">
                  {fmtDate(hold.start)} → {fmtDate(hold.end)} · {nights(hold.start, hold.end)} nights · {hold.createdBy}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRelease(hold.id)}
                className="text-[12px] font-medium text-danger hover:underline"
              >
                Release
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <EmptyState
          icon={BedDouble}
          title="No maintenance holds"
          description="Beds taken out of service appear here."
          compact
        />
      )}
    </Card>
  )
}
