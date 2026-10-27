import { useState } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { CURRENCIES, toUsd } from '../data/core'
import { chargesByCurrency } from '../data/folio'
import { fmtDate } from '../lib/format'
import { ActionButton, Card, SectionTitle } from '../components/ui'
import { Field, Input, Select } from '../components/form'
import { EmptyState, Money, Skeleton } from '../components/feedback'

export function ChargesCard({ booking, lines, payments, totals, onAdd, loading }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState({ description: '', amount: '', kind: 'Extras', currency: booking.currency })
  const breakdown = chargesByCurrency(lines, booking.currency)

  const submit = () => {
    const amount = Number(draft.amount)
    if (!draft.description.trim() || !amount) return
    onAdd({
      id: `f-${Date.now()}`,
      date: '2026-09-17',
      description: draft.description.trim(),
      qty: 1,
      unit: amount,
      amount,
      kind: draft.kind,
      currency: draft.currency,
    })
    setDraft({ description: '', amount: '', kind: 'Extras', currency: booking.currency })
    setOpen(false)
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <SectionTitle hint={booking.id}>Charges</SectionTitle>
        <ActionButton variant="secondary" size="sm" icon={Plus} onClick={() => setOpen((value) => !value)}>
          Add extra charge
        </ActionButton>
      </div>

      {open ? (
        <div className="grid grid-cols-[1fr_90px_120px_140px_auto] items-end gap-2 border-y border-line bg-page px-6 py-3">
          <Field label="Description" htmlFor="charge-desc">
            <Input id="charge-desc" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
          </Field>
          <Field label="Currency" htmlFor="charge-currency">
            <Select id="charge-currency" value={draft.currency} onChange={(event) => setDraft({ ...draft, currency: event.target.value })}>
              {CURRENCIES.map((item) => <option key={item.code} value={item.code}>{item.code}</option>)}
            </Select>
          </Field>
          <Field label="Amount" htmlFor="charge-amount">
            <Input id="charge-amount" type="number" value={draft.amount} onChange={(event) => setDraft({ ...draft, amount: event.target.value })} />
          </Field>
          <Field label="Type" htmlFor="charge-kind">
            <Select id="charge-kind" value={draft.kind} onChange={(event) => setDraft({ ...draft, kind: event.target.value })}>
              <option>Extras</option>
              <option>Restaurant</option>
              <option>Bar</option>
              <option>Souvenirs</option>
              <option>Laundry</option>
              <option>Tour</option>
            </Select>
          </Field>
          <ActionButton onClick={submit} disabled={!draft.description.trim() || !Number(draft.amount)}>
            Add
          </ActionButton>
        </div>
      ) : null}

      {loading ? (
        <div className="flex flex-col gap-2 px-6 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      ) : lines.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No charges on this folio"
          description="Room charges appear when the booking is created."
          action={<ActionButton size="sm" onClick={() => setOpen(true)}>Add extra charge</ActionButton>}
          compact
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="border-y border-line">
                <th className="px-6 py-2 text-label uppercase tracking-[0.08em] text-muted">Date</th>
                <th className="px-3 py-2 text-label uppercase tracking-[0.08em] text-muted">Description</th>
                <th className="px-3 py-2 text-right text-label uppercase tracking-[0.08em] text-muted">Qty</th>
                <th className="px-3 py-2 text-right text-label uppercase tracking-[0.08em] text-muted">Unit</th>
                <th className="px-6 py-2 text-right text-label uppercase tracking-[0.08em] text-muted">Amount</th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line) => (
                <tr key={line.id} className="border-b border-line last:border-0">
                  <td className="tnum px-6 py-3 text-[13px] text-muted">{fmtDate(line.date)}</td>
                  <td className="px-3 py-3 text-[14px] text-ink">
                    {line.description}
                    <span className="ml-2 rounded-full border border-line px-1.5 py-0.5 text-[10px] text-muted">{line.kind}</span>
                  </td>
                  <td className="tnum px-3 py-3 text-right text-[13px]">{line.qty}</td>
                  <td className="px-3 py-3 text-right text-[13px]"><Money amount={line.unit} currency={line.currency ?? booking.currency} size="sm" /></td>
                  <td className="px-6 py-3 text-right text-[14px]"><Money amount={line.amount} currency={line.currency ?? booking.currency} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-col gap-2 border-t border-line bg-page px-6 py-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
          <span className="text-label uppercase tracking-[0.08em] text-muted">Owed by currency</span>
          {Object.entries(breakdown).map(([code, amount]) => (
            <span key={code} className="inline-flex items-center gap-1 text-[13px] text-ink">
              <Money amount={amount} currency={code} size="sm" />
              {code !== 'USD' ? <span className="text-[10px] text-muted">≈ {toUsd(amount, code).toLocaleString('en-US')} USD</span> : null}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-x-8 gap-y-1 text-[13px]">
          <span className="text-muted">Total <Money amount={totals.charges} currency="USD" className="ml-1" /></span>
          <span className="text-muted">Paid <Money amount={totals.paid} currency={booking.currency} className="ml-1" /></span>
          <span className="font-semibold text-ink">Balance <Money amount={totals.balance} currency="USD" className="ml-1" /></span>
        </div>
      </div>

      {payments.length ? (
        <div className="border-t border-line px-6 py-3">
          <p className="text-label uppercase tracking-[0.08em] text-muted">Payments received</p>
          <ul className="mt-1.5 flex flex-col gap-1">
            {payments.map((payment) => (
              <li key={payment.id} className="flex items-center justify-between text-[12px]">
                <span className="text-muted">{fmtDate(payment.date)} · {payment.description} · {payment.method}</span>
                <Money amount={payment.amount} currency={booking.currency} size="sm" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  )
}
