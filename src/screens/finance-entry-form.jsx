import { useState } from 'react'
import { TODAY } from '../data/core'
import { money } from '../lib/format'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { ActionButton, Card, SectionTitle } from '../components/ui'
import { Callout } from '../components/feedback'
import { SegmentedControl } from '../components/tabs'
import { FinanceEntryFields } from './finance-entry-fields'

export function accountName(accounts, id) {
  return accounts.find((account) => account.id === id)?.name ?? 'No account'
}

export function FinanceEntryForm({ onRecorded }) {
  const { hostel, hostelAccounts, user, guests, addStaffEntry, addLedgerEntry, notify } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const [form, setForm] = useState({
    type: 'Income',
    category: state === 'filled' ? 'Bar' : 'Room booking',
    date: TODAY,
    item: state === 'filled' ? '2 Beers' : '',
    amount: state === 'filled' ? '240' : '',
    currency: hostel.currency,
    method: 'Cash',
    accountId: hostelAccounts.find((account) => account.currency === hostel.currency)?.id ?? hostelAccounts[0]?.id ?? '',
    guest: '',
    guestId: '',
    remark: '',
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState(state === 'submitted')
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))
  const accounts = hostelAccounts

  const submit = (event) => {
    event.preventDefault()
    setError(null)
    if (!form.amount || Number(form.amount) <= 0) return setError('Enter an amount greater than zero.')
    if (!form.accountId) return setError('Choose the account this money moves through.')
    if (form.type === 'Income' && form.category === 'Room booking' && !form.guestId) {
      return setError('Select the guest this room-booking payment belongs to.')
    }
    setBusy(true)
    window.setTimeout(() => {
      const entry = {
        id: `entry-${Date.now()}`,
        date: form.date,
        type: form.type,
        category: form.category,
        description: form.item.trim() || `${form.category}${form.guest ? ` · ${form.guest}` : ''}`,
        amount: Number(form.amount),
        currency: form.currency,
        method: form.method,
        accountId: form.accountId,
        by: user.name,
        at: '12:24',
        guest: form.guest,
        guestId: form.guestId,
        folio: guests.find((item) => item.id === form.guestId)?.folio ?? '',
        remark: form.remark.trim(),
      }
      addStaffEntry(entry)
      addLedgerEntry({
        ...entry,
        id: `manual-${Date.now()}`,
        hostelId: hostel.id,
        recordedBy: user.name,
        ref: `TXN-${Date.now()}`,
        createdAt: `${form.date} 12:24`,
      })
      setBusy(false)
      setSuccess(true)
      setForm((current) => ({ ...current, item: '', amount: '', guest: '', guestId: '', remark: '' }))
      notify({
        title: `${form.type} recorded`,
        description: `${money(entry.amount, form.currency)} · ${form.category} · ${accountName(hostelAccounts, form.accountId)}`,
      })
      onRecorded?.()
    }, 550)
  }

  return (
    <Card className="p-6">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle>New entry</SectionTitle>
          <SegmentedControl
            items={[{ id: 'Income', label: 'Income' }, { id: 'Expense', label: 'Expense' }]}
            value={form.type}
            onChange={(value) => {
              set('type')(value)
              set('category')(value === 'Income' ? 'Room booking' : 'Utilities')
              setSuccess(false)
            }}
          />
        </div>

        {success ? (
          <Callout tone="success" title="Entry recorded">
            It is in the {hostel.short} ledger. The admin sees it immediately.
          </Callout>
        ) : null}

        {error ? <Callout tone="danger" title="Check this entry">{error}</Callout> : null}

        <FinanceEntryFields form={form} set={set} accounts={accounts} hostel={hostel} guests={guests} />

        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <button
            type="button"
            onClick={() => {
              setForm((current) => ({ ...current, item: '', amount: '', guest: '', guestId: '', remark: '' }))
              setError(null)
              setSuccess(false)
            }}
            className="text-[12px] font-medium text-muted hover:text-ink"
          >
            Clear form
          </button>
          <ActionButton type="submit" loading={busy}>
            Record {form.type.toLowerCase()}
          </ActionButton>
        </div>
      </form>
    </Card>
  )
}
