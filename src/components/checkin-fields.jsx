import { CURRENCIES } from '../data/core'
import { Banknote, CreditCard, Smartphone } from 'lucide-react'
import { Checkbox, Field, Input, Select } from './form'
import { Money } from './feedback'
import { cx } from './ui'

const METHODS = [
  { id: 'Cash', label: 'Cash', icon: Banknote },
  { id: 'Card', label: 'Card', icon: CreditCard },
  { id: 'M-Pesa', label: 'M-Pesa', icon: Smartphone },
]

export function CheckInFields({ form, set, booking, user, hostel, options, account, staleAccount, error, disabled }) {
  const payable = form.noPayment ? 0 : form.amount
  return (
    <div className="flex flex-col gap-4">
      <Checkbox
        id="no-payment"
        label="No payment now"
        description={
          booking.balance > 0
            ? 'Only available when the booking is prepaid in full.'
            : 'Booking is prepaid; check in without taking money.'
        }
        checked={form.noPayment}
        disabled={booking.balance > 0 || disabled}
        onChange={(event) => set('noPayment')(event.target.checked)}
        className="rounded-control border border-line bg-card px-3 py-2.5"
      />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Amount" htmlFor="pay-amount">
          <Input
            id="pay-amount"
            type="number"
            min="0"
            value={form.noPayment ? 0 : form.amount}
            onChange={(event) => set('amount')(Number(event.target.value))}
            disabled={form.noPayment || disabled}
          />
        </Field>
        <Field label="Currency" htmlFor="pay-currency">
          <Select
            id="pay-currency"
            value={form.currency}
            onChange={(event) => set('currency')(event.target.value)}
            disabled={form.noPayment || disabled}
          >
            {CURRENCIES.map((item) => (
              <option key={item.code} value={item.code}>{item.code}</option>
            ))}
          </Select>
        </Field>
      </div>

      <div>
        <p className="text-label uppercase tracking-[0.08em] text-muted">Payment method</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {METHODS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              aria-pressed={form.method === id}
              disabled={form.noPayment || disabled}
              onClick={() => set('method')(id)}
              className={cx(
                'flex h-10 items-center justify-center gap-2 rounded-control border text-[13px]',
                form.method === id
                  ? 'border-primary bg-tint font-medium text-primary'
                  : 'border-line bg-card text-ink hover:bg-page',
                form.noPayment && 'opacity-55',
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <Field
        label="Deposit account"
        htmlFor="pay-account"
        hint={`Only ${hostel.short} accounts in ${form.currency} are listed.`}
        error={account && account.currency !== form.currency ? error : undefined}
      >
        <Select
          id="pay-account"
          value={form.accountId}
          onChange={(event) => set('accountId')(event.target.value)}
          disabled={form.noPayment || disabled}
          invalid={Boolean(account && account.currency !== form.currency)}
        >
          {!options.some((item) => item.id === form.accountId) ? (
            <option value={form.accountId}>
              {staleAccount ? `${staleAccount.name} · ${staleAccount.currency}` : 'Select an account'}
            </option>
          ) : null}
          {options.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} · {item.currency} {item.balance.toLocaleString('en-US')}
            </option>
          ))}
        </Select>
      </Field>

      <Field label="Checked in by" htmlFor="pay-by">
        <Input id="pay-by" value={user.name} readOnly className="bg-page" />
      </Field>

      {booking.balance > 0 ? (
        <p className="text-[11px] text-muted">
          Balance after this payment:{' '}
          <Money amount={Math.max(0, booking.balance - payable)} currency={booking.currency} size="sm" />
        </p>
      ) : null}
    </div>
  )
}
