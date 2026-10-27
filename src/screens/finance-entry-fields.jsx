import { useMemo, useState } from 'react'
import { CATEGORIES } from '../data/finance'
import { FCY_CURRENCIES, PAYMENT_METHODS } from '../data/core'
import { initials } from '../lib/format'
import { Field, Input, Select, Textarea } from '../components/form'
import { Avatar, Money } from '../components/feedback'

const REMARK_SUGGESTIONS = ['staff', 'not paid', 'paid']

function GuestPicker({ guests, value, onSelect, onClear }) {
  const [query, setQuery] = useState('')
  const selected = guests.find((guest) => guest.id === value)
  const term = query.trim().toLowerCase()
  const filtered = useMemo(() => {
    if (!term) return guests
    return guests.filter((guest) =>
      [guest.name, guest.country, guest.email, guest.phone].some((field) =>
        String(field ?? '').toLowerCase().includes(term),
      ),
    )
  }, [guests, term])

  if (selected) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-control border border-line bg-page px-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar initials={initials(selected.name)} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{selected.name}</p>
            <p className="text-[11px] text-muted">
              {selected.folio ? `Folio ${selected.folio} · ` : ''}
              {selected.balance > 0 ? (
                <>
                  Balance <Money amount={selected.balance} currency={selected.currency} size="sm" />
                </>
              ) : (
                'No balance'
              )}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="shrink-0 text-[12px] font-medium text-primary hover:text-primary-hover"
        >
          Change
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Input
        id="fe-guest"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search guests by name, phone or email"
      />
      <div className="max-h-52 overflow-auto rounded-control border border-line bg-card">
        {filtered.length ? (
          filtered.map((guest) => (
            <button
              key={guest.id}
              type="button"
              onClick={() => {
                onSelect(guest.id)
                setQuery('')
              }}
              className="flex w-full items-center justify-between gap-2 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-page"
            >
              <div className="min-w-0">
                <p className="truncate text-[13px] text-ink">{guest.name}</p>
                <p className="text-[11px] text-muted">{guest.country} · {guest.folio || 'No folio'}</p>
              </div>
              {guest.balance > 0 ? (
                <Money amount={guest.balance} currency={guest.currency} size="sm" className="text-warning" />
              ) : (
                <span className="text-[11px] text-muted">Paid</span>
              )}
            </button>
          ))
        ) : (
          <p className="px-3 py-2 text-[12px] text-muted">No registered guests match “{query}”.</p>
        )}
      </div>
    </div>
  )
}

export function FinanceEntryFields({ form, set, accounts, hostel, guests = [] }) {
  const isIncome = form.type === 'Income'
  const selectedAccount = accounts.find((account) => account.id === form.accountId)
  const isFcy = selectedAccount?.currency === 'FCY'

  const onAccountChange = (accountId) => {
    const account = accounts.find((item) => item.id === accountId)
    set('accountId')(accountId)
    if (account && account.currency !== 'FCY') {
      set('currency')(account.currency)
    } else if (account && account.currency === 'FCY' && !FCY_CURRENCIES.includes(form.currency)) {
      set('currency')('USD')
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Date of entry" htmlFor="fe-date" hint="Defaults to today; backdate if needed.">
          <Input id="fe-date" type="date" value={form.date} onChange={(event) => set('date')(event.target.value)} />
        </Field>
        <Field label="Category" htmlFor="fe-category">
          <Select id="fe-category" value={form.category} onChange={(event) => set('category')(event.target.value)}>
            {CATEGORIES[form.type].map((item) => <option key={item}>{item}</option>)}
          </Select>
        </Field>
      </div>

      <Field
        label={isIncome ? 'Item sold' : 'Items'}
        htmlFor="fe-item"
        hint={isIncome ? 'What was sold, e.g. “2 Beers”.' : 'What was bought, e.g. “Cleaning supplies”.'}
      >
        <Input id="fe-item" value={form.item} onChange={(event) => set('item')(event.target.value)} />
      </Field>

      <div className="grid grid-cols-[1fr_120px] gap-3">
        <Field label="Amount" htmlFor="fe-amount">
          <Input id="fe-amount" type="number" min="0" value={form.amount} onChange={(event) => set('amount')(event.target.value)} />
        </Field>
        <Field label="Currency" htmlFor="fe-currency" hint={isFcy ? 'Foreign currency' : 'Local currency'}>
          {isFcy ? (
            <Select id="fe-currency" value={form.currency} onChange={(event) => set('currency')(event.target.value)}>
              {FCY_CURRENCIES.map((code) => <option key={code}>{code}</option>)}
            </Select>
          ) : (
            <Input id="fe-currency" value={hostel.currency} readOnly className="bg-page" />
          )}
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Payment method" htmlFor="fe-method">
          <Select id="fe-method" value={form.method} onChange={(event) => set('method')(event.target.value)}>
            {PAYMENT_METHODS.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </Field>
        <Field
          label={isIncome ? 'Deposit account' : 'Withdrawal account'}
          htmlFor="fe-account"
          hint={isFcy ? 'Foreign currency account — pick the currency above.' : `Local ${hostel.currency} account.`}
        >
          <Select id="fe-account" value={form.accountId} onChange={(event) => onAccountChange(event.target.value)}>
            <option value="">Select an account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.currency} {account.balance.toLocaleString('en-US')}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {isIncome && form.category === 'Room booking' ? (
        <Field label="Guest" htmlFor="fe-guest" hint="Search and select the registered guest this payment belongs to.">
          <GuestPicker
            guests={guests}
            value={form.guestId}
            onSelect={(guestId) => {
              const guest = guests.find((item) => item.id === guestId)
              set('guestId')(guestId)
              set('guest')(guest?.name ?? '')
            }}
            onClear={() => {
              set('guestId')('')
              set('guest')('')
            }}
          />
        </Field>
      ) : null}

      <Field label="Remark" htmlFor="fe-remark" hint="Optional note.">
        <Textarea id="fe-remark" value={form.remark} onChange={(event) => set('remark')(event.target.value)} />
      </Field>
      <div className="-mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-muted">Quick:</span>
        {REMARK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            onClick={() => set('remark')(form.remark ? `${form.remark} · ${suggestion}` : suggestion)}
            className="rounded-full border border-line bg-card px-2 py-0.5 text-[11px] text-muted transition-colors hover:border-primary hover:text-primary"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </>
  )
}
