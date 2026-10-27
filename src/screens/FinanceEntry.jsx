import { ArrowRight, Receipt, Sparkles } from 'lucide-react'
import { fmtDate } from '../lib/format'
import { TODAY } from '../data/core'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { Card, PageHeader, SectionTitle } from '../components/ui'
import { Badge, Callout, EmptyState, Money, Skeleton } from '../components/feedback'
import { FinanceEntryForm, accountName } from './finance-entry-form'

export default function FinanceEntry() {
  const { hostel, hostelAccounts, user, todayEntries } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const entries = state === 'empty' ? [] : todayEntries

  const totals = entries.reduce((acc, entry) => {
    acc[entry.currency] = acc[entry.currency] ?? { income: 0, expense: 0 }
    if (entry.type === 'Income') acc[entry.currency].income += entry.amount
    else acc[entry.currency].expense += entry.amount
    return acc
  }, {})

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Receipt}
        title="Finance entry"
        subtitle={`${hostel.short} · ${fmtDate(TODAY)} · log what crossed the desk.`}
        actions={
          <span className="flex items-center gap-2 rounded-control border border-line bg-card px-3 py-2 text-[12px] text-ink">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-tint text-[10px] font-semibold text-primary">
              {user.initials}
            </span>
            Handled by {user.name}
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
        {state === 'loading' ? (
          <Card className="p-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-6 h-9 w-full" />
            <Skeleton className="mt-3 h-9 w-full" />
            <Skeleton className="mt-3 h-9 w-2/3" />
            <Skeleton className="mt-6 h-10 w-36" />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {state === 'error' ? (
              <Callout tone="danger" title="Couldn’t save that entry">
                The account did not accept the entry. Nothing was recorded; check the account and try again.
              </Callout>
            ) : null}
            <FinanceEntryForm />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Card className="p-4">
            <SectionTitle hint="This staff member only">Today by you</SectionTitle>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(totals).length ? (
                Object.entries(totals).map(([code, value]) => (
                  <div key={code} className="rounded-control border border-line bg-page px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.08em] text-muted">{code}</p>
                    <p className="tnum mt-0.5 text-[12px] text-ink">In {value.income.toLocaleString('en-US')}</p>
                    <p className="tnum text-[12px] text-ink">Out {value.expense.toLocaleString('en-US')}</p>
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">Nothing recorded by you today.</p>
              )}
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3">
              <SectionTitle hint={`${entries.length} today`}>Today’s entries</SectionTitle>
            </div>
            {entries.length ? (
              <ul className="divide-y divide-line border-t border-line">
                {entries.map((entry) => (
                  <li key={entry.id} className="flex items-start justify-between gap-3 px-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-ink">{entry.description || entry.category}</p>
                      <p className="text-[11px] text-muted">
                        {entry.at} · {entry.category} · {entry.method} · {accountName(hostelAccounts, entry.accountId)}
                        {entry.guest ? ` · ${entry.guest}` : ''}
                      </p>
                    </div>
                    <span className="flex flex-col items-end gap-1">
                      <Money amount={entry.amount} currency={entry.currency} size="sm" className="font-medium" />
                      <Badge tone={entry.type === 'Income' ? 'success' : 'neutral'} dot>{entry.type}</Badge>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={Receipt}
                title="Nothing logged today yet"
                description="Your first entry will appear here."
                compact
              />
            )}
            <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 text-[11px] text-muted">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Entries appear for the admin under Admin finance.
              <ArrowRight className="ml-auto h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
