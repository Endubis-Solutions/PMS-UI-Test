import { useMemo, useState } from 'react'
import { ArrowLeftRight, Download, Lock, Wallet } from 'lucide-react'
import { fmtDate } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader } from '../components/ui'
import { DataTable } from '../components/table'
import { AccountStrip } from '../components/account-strip'
import { Badge, Callout, EmptyState, Money } from '../components/feedback'
import { FinanceFilterBar } from './finance-filter-bar'
import { DEFAULT_FILTERS, RANGES, filterLedger, toCsv } from './ledger-filters'

export default function FinanceLog() {
  const { isAdmin, hostel, hostelAccounts, hostelLedger, notify } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const preset = query.preset
  const [filters, setFilters] = useState(
    preset === 'laundry-last-month'
      ? { ...DEFAULT_FILTERS, range: 'last-month', category: 'Laundry' }
      : preset === 'filtered-empty'
        ? { ...DEFAULT_FILTERS, category: 'Laundry' }
        : DEFAULT_FILTERS,
  )
  const [retried, setRetried] = useState(false)
  const rows = useMemo(
    () => filterLedger(hostelLedger, filters, { empty: state === 'empty', preset }),
    [hostelLedger, filters, state, preset],
  )
  const people = useMemo(() => Array.from(new Set(hostelLedger.map((entry) => entry.recordedBy))), [hostelLedger])

  if (!isAdmin) {
    return (
      <EmptyState
        icon={Lock}
        title="Admin access required"
        description="Admin finance is limited to the owner account. Staff record daily entries from Finance entry."
        action={<ActionButton onClick={() => navigate('/finance-entry')}>Go to Finance entry</ActionButton>}
      />
    )
  }

  const range = RANGES.find((item) => item.id === filters.range) ?? RANGES[0]

  const exportCsv = () => {
    const blob = new Blob([toCsv(rows, hostelAccounts)], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${hostel.id}-ledger-${filters.range}.csv`
    link.click()
    URL.revokeObjectURL(url)
    notify({ title: 'CSV exported', description: `${rows.length} rows · ${hostel.short} · ready for the ERP.` })
  }

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        icon={Wallet}
        title="Admin finance"
        subtitle={`${hostel.short} · ${hostel.currency} accounts · every row belongs to this property.`}
        actions={
          <>
            <ActionButton variant="secondary" icon={ArrowLeftRight} onClick={() => navigate('/finance/transfers')}>
              Transfers
            </ActionButton>
            <ActionButton variant="secondary" icon={Download} onClick={exportCsv}>
              Export CSV
            </ActionButton>
          </>
        }
      />

      <AccountStrip accounts={hostelAccounts} />

      {state === 'error' && !retried ? (
        <Callout
          tone="danger"
          title="Couldn’t load the ledger"
          action={<ActionButton variant="secondary" size="sm" onClick={() => setRetried(true)}>Try again</ActionButton>}
        >
          Transactions did not load. The balances above are the last reconciled figures.
        </Callout>
      ) : null}

      <FinanceFilterBar
        filters={filters}
        set={setFilters}
        accounts={hostelAccounts}
        people={people}
        rowCount={rows.length}
        onClear={() => setFilters(DEFAULT_FILTERS)}
      />

      <Card className="overflow-hidden">
        <DataTable
          rows={rows}
          loading={state === 'loading'}
          columns={[
            { key: 'date', header: 'Date', width: 96, render: (row) => <span className="tnum text-[13px] text-muted">{fmtDate(row.date)}</span> },
            { key: 'type', header: 'Type', width: 96, render: (row) => <Badge tone={row.type === 'Income' ? 'success' : 'neutral'} dot>{row.type}</Badge> },
            {
              key: 'detail',
              header: 'Category and detail',
              render: (row) => (
                <div>
                  <p className="text-[13px] font-medium text-ink">{row.category}</p>
                  <p className="text-[11px] text-muted">{row.description}</p>
                </div>
              ),
            },
            {
              key: 'account',
              header: 'Account',
              width: 150,
              render: (row) => (
                <span className="text-[13px]">
                  {hostelAccounts.find((account) => account.id === row.accountId)?.name}
                </span>
              ),
            },
            { key: 'method', header: 'Method', width: 120, render: (row) => <span className="text-[13px] text-muted">{row.method}</span> },
            { key: 'by', header: 'Recorded by', width: 130, render: (row) => <span className="text-[13px] text-muted">{row.recordedBy}</span> },
            {
              key: 'amount',
              header: 'Amount',
              align: 'right',
              width: 150,
              render: (row) => (
                <span className="inline-flex items-center gap-1">
                  <span className="text-[12px] text-muted">{row.type === 'Income' ? '+' : '−'}</span>
                  <Money amount={row.amount} currency={row.currency} className="font-medium" />
                </span>
              ),
            },
          ]}
          empty={
            <EmptyState
              icon={Wallet}
              title="No transactions match these filters"
              description={`Nothing in ${hostel.short} matches this combination.`}
              action={<ActionButton variant="secondary" onClick={() => setFilters(DEFAULT_FILTERS)}>Clear filters</ActionButton>}
              compact
            />
          }
        />

        <div className="border-t border-line px-6 py-2.5 text-[11px] text-muted">
          {range.label} · {filters.category === 'all' ? 'all categories' : filters.category} · {hostel.short}
        </div>
      </Card>
    </div>
  )
}

