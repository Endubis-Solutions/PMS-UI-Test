import { useState } from 'react'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import { ActionButton, cx } from '../components/ui'
import { Field, Input, Select } from '../components/form'

const METHODS = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'Card', label: 'Card', icon: CreditCard },
  { id: 'M-Pesa', label: 'M-Pesa', icon: Smartphone },
]

export function RecordPaymentCard({ booking, balance, accounts, onRecord }) {
  const [method, setMethod] = useState('Cash')
  const [amount, setAmount] = useState(balance > 0 ? balance : '')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? '')
  const value = Number(amount)
  const valid = value > 0 && value <= balance

  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="text-label uppercase tracking-[0.08em] text-muted">Payment method</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={method === id}
              onClick={() => setMethod(id)}
              className={cx(
                'flex h-9 items-center justify-center gap-1.5 rounded-control border text-[12px]',
                method === id
                  ? 'border-primary bg-tint font-medium text-primary'
                  : 'border-line bg-card text-ink hover:bg-page',
              )}
            >
              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[1fr_1fr] gap-3">
        <Field label="Amount" htmlFor="fp-amount">
          <Input id="fp-amount" type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
        </Field>
        <Field label="Deposit account" htmlFor="fp-account">
          <Select id="fp-account" value={accountId} onChange={(event) => setAccountId(event.target.value)}>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.currency}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <ActionButton disabled={!valid} onClick={() => onRecord({ method, amount: value, accountId })}>
        Record {booking.currency} {value > 0 ? value.toLocaleString('en-US') : '0'} payment
      </ActionButton>
      {balance > 0 && value > balance ? (
        <p className="text-[11px] text-danger">Amount is more than the open balance ({booking.currency} {balance.toLocaleString('en-US')}).</p>
      ) : null}
    </div>
  )
}