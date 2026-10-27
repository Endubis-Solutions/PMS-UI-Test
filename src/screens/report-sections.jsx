import { SourceBadge } from '../components/data'
import { DataTable } from '../components/table'
import { Money } from '../components/feedback'
import { SOURCES, toUsd } from '../data/core'

export function SourceBars({ sources }) {
  const max = Math.max(...sources.map((item) => item.count), 1)
  const total = sources.reduce((sum, item) => sum + item.count, 0)
  return (
    <div className="flex flex-col gap-3">
      {sources.map((item) => (
        <div key={item.id}>
          <div className="flex items-center justify-between gap-3 text-[12px]">
            <span className="flex items-center gap-2 text-ink">
              <span className={`h-2 w-2 rounded-full ${SOURCES[item.id]?.dot ?? 'bg-blocked'}`} aria-hidden="true" />
              {item.label}
            </span>
            <span className="tnum text-muted">
              {item.count} · {Math.round((item.count / total) * 100)}%
            </span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(item.count / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export function RevenueList({ revenue }) {
  const items = revenue.map((item) => ({ ...item, usd: toUsd(item.value, item.currency) }))
  const max = Math.max(...items.map((item) => item.usd), 1)
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-center justify-between gap-3 text-[12px]">
            <span className="text-ink">{item.label}</span>
            <Money amount={item.usd} currency="USD" size="sm" className="font-medium" />
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-primary/60" style={{ width: `${(item.usd / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function AuditTable({ rows, loading }) {
  return (
    <DataTable
      rows={rows}
      loading={loading}
      minWidth={900}
      columns={[
        { key: 'at', header: 'When', width: 170, render: (row) => <span className="tnum text-[13px] text-muted">{row.at}</span> },
        { key: 'actor', header: 'Actor', width: 140, render: (row) => <span className="text-[13px] text-ink">{row.actor}</span> },
        { key: 'action', header: 'Action', width: 160, render: (row) => <span className="text-[13px] font-medium text-ink">{row.action}</span> },
        { key: 'entity', header: 'Record', width: 220, render: (row) => <span className="text-[13px] text-ink">{row.entity}</span> },
        { key: 'detail', header: 'Detail', render: (row) => <span className="text-[13px] text-muted">{row.detail}</span> },
        { key: 'source', header: 'Source', width: 130, render: (row) => <SourceBadge source={row.source} withLabel /> },
      ]}
    />
  )
}
