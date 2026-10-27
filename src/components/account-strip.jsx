import { Banknote, Landmark, PiggyBank } from 'lucide-react'
import { fmtDate } from '../lib/format'
import { Card } from './ui'
import { Money } from './feedback'

export function AccountStrip({ accounts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {accounts.map((account) => {
        const Icon = account.kind === 'Cash' ? Banknote : account.kind === 'Saving' ? PiggyBank : Landmark
        return (
          <Card key={account.id} className="p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-label uppercase tracking-[0.08em] text-muted">{account.kind}</p>
                <p className="mt-1 text-[13px] font-medium text-ink">{account.name}</p>
              </div>
              <Icon className="h-4 w-4 text-muted" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <p className="mt-3">
              <Money amount={account.balance} currency={account.currency} size="lg" className="font-semibold text-ink" />
            </p>
            <p className="mt-1 text-[11px] text-muted">Reconciled {account.reconciled}</p>
          </Card>
        )
      })}
    </div>
  )
}

export function TransferRow({ transfer, accounts }) {
  const from = accounts.find((account) => account.id === transfer.fromId)
  const to = accounts.find((account) => account.id === transfer.toId)
  if (!from || !to) return null
  return (
    <div className="flex flex-col gap-1 rounded-control border border-line bg-page p-3">
      <div className="flex items-center justify-between gap-2 text-[12px]">
        <span className="font-medium text-ink">{from.name}</span>
        <span className="text-muted">→</span>
        <span className="font-medium text-ink">{to.name}</span>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted">
        <span>{fmtDate(transfer.date)} · {transfer.by}</span>
        <span className="tnum text-ink">
          <Money amount={transfer.amount} currency={from.currency} size="sm" />
          {from.currency !== to.currency ? (
            <> → <Money amount={transfer.toAmount} currency={to.currency} size="sm" /></>
          ) : null}
        </span>
      </div>
    </div>
  )
}
