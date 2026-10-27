import { useState } from 'react'
import { BarChart3, Lock } from 'lucide-react'
import { REPORT } from '../data/ops'
import { toUsd } from '../data/core'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader, SectionTitle } from '../components/ui'
import { Select } from '../components/form'
import { Callout, EmptyState, Skeleton } from '../components/feedback'
import { RevenueList, SourceBars } from './report-sections'

export default function Reports() {
  const { isAdmin, hostel, hostelId } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const [range, setRange] = useState('1-17')
  const [retried, setRetried] = useState(false)
  const data = REPORT[hostelId]

  if (!isAdmin) {
    return (
      <EmptyState
        icon={Lock}
        title="Admin access required"
        description="Reports are limited to the owner account. Staff can see today’s activity on the dashboard."
        action={<ActionButton onClick={() => navigate('/dashboard')}>Back to dashboard</ActionButton>}
      />
    )
  }

  const empty = state === 'empty' || range === 'none'
  const loading = state === 'loading'
  const failed = state === 'error' && !retried

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BarChart3}
        title="Reports"
        subtitle={`${hostel.short} · 1–17 Sep 2026 · occupancy and revenue shown in USD.`}
        actions={
          <Select aria-label="Date range" value={range} onChange={(event) => setRange(event.target.value)} className="w-[190px]">
            <option value="1-17">1–17 Sep 2026</option>
            <option value="month">September 2026</option>
            <option value="quarter">Jul – Sep 2026</option>
            <option value="none">No activity range</option>
          </Select>
        }
      />

      {failed ? (
        <Callout
          tone="danger"
          title="Couldn’t load this report"
          action={<ActionButton variant="secondary" size="sm" onClick={() => setRetried(true)}>Try again</ActionButton>}
        >
          Occupancy and revenue did not load. Nothing has been changed.
        </Callout>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <Card key={kpi.label} className="p-5">
            <p className="text-label uppercase tracking-[0.08em] text-muted">{kpi.label}</p>
            {loading ? (
              <Skeleton className="mt-3 h-8 w-24" />
            ) : (
              <p className="tnum mt-2 text-[26px] font-semibold leading-8 text-ink">{empty ? '—' : kpi.currency ? `USD ${toUsd(kpi.value, kpi.currency).toLocaleString('en-US')}` : kpi.value}</p>
            )}
            <p className="mt-1 text-[11px] text-muted">{kpi.detail}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="p-6">
          <SectionTitle hint={`${data.sources.reduce((sum, item) => sum + item.count, 0)} bookings`}>
            Bookings by source
          </SectionTitle>
          {loading ? (
            <div className="mt-4 flex flex-col gap-3">
              {[0, 1, 2, 3].map((key) => <Skeleton key={key} className="h-6 w-full" />)}
            </div>
          ) : empty ? (
            <p className="mt-4 text-[13px] text-muted">No bookings in this range.</p>
          ) : (
            <div className="mt-4"><SourceBars sources={data.sources} /></div>
          )}
        </Card>

        <Card className="p-6">
          <SectionTitle hint="Converted to USD">Revenue by room type</SectionTitle>
          {loading ? (
            <div className="mt-4 flex flex-col gap-3">
              {[0, 1, 2].map((key) => <Skeleton key={key} className="h-6 w-full" />)}
            </div>
          ) : empty ? (
            <p className="mt-4 text-[13px] text-muted">No revenue in this range.</p>
          ) : (
            <div className="mt-4"><RevenueList revenue={data.revenue} /></div>
          )}
        </Card>
      </div>
    </div>
  )
}
