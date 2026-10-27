import { useState } from 'react'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { ActionButton, Card, SectionTitle } from '../components/ui'
import { Field, Input, Select, Textarea } from '../components/form'
import { Callout, Money } from '../components/feedback'

export function TransferForm() {
  const { hostel, hostelAccounts, addTransfer, notify } = useApp()
  const { query } = useRoute()
  const preset = query.state === 'insufficient'
  const [fromId, setFromId] = useState(preset ? 'addis-cash-usd' : hostelAccounts[0]?.id ?? '')
  const [toId, setToId] = useState(preset ? 'addis-bank-usd' : hostelAccounts[1]?.id ?? '')
  const [amount, setAmount] = useState(preset ? 5000 : '')
  const [toAmount, setToAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState(
    preset ? 'FCY cash holds FCY 1,240. A transfer of FCY 5,000 is not possible.' : null,
  )
  const [busy, setBusy] = useState(false)

  const from = hostelAccounts.find((account) => account.id === fromId)
  const to = hostelAccounts.find((account) => account.id === toId)
  const crossCurrency = Boolean(from && to && from.currency !== to.currency)
  const value = Number(amount || 0)

  const submit = () => {
    setError(null)
    if (!from || !to) return setError('Choose both accounts.')
    if (from.id === to.id) return setError('Choose two different accounts.')
    if (!value || value <= 0) return setError('Enter an amount greater than zero.')
    if (value > from.balance) {
      return setError(
        `${from.name} holds ${from.currency} ${from.balance.toLocaleString('en-US')}. A transfer of ${from.currency} ${value.toLocaleString('en-US')} is not possible.`,
      )
    }
    setBusy(true)
    window.setTimeout(() => {
      addTransfer({
        id: `TR-${Math.floor(Math.random() * 900 + 100)}`,
        hostelId: hostel.id,
        date: '2026-09-17',
        fromId: from.id,
        toId: to.id,
        amount: value,
        toAmount: crossCurrency ? Number(toAmount || 0) : value,
        by: 'Almaz Tesfaye',
        note: note || 'Balance transfer',
      })
      setBusy(false)
      setAmount('')
      setToAmount('')
      setNote('')
      notify({
        title: 'Transfer recorded',
        description: `${from.name} → ${to.name} · ${from.currency} ${value.toLocaleString('en-US')}`,
      })
    }, 600)
  }

  return (
    <Card className="p-6">
      <SectionTitle hint="Same property only">New transfer</SectionTitle>
      <div className="mt-4 flex flex-col gap-4">
        <Field label="From account" htmlFor="tr-from">
          <Select id="tr-from" value={fromId} onChange={(event) => setFromId(event.target.value)}>
            {hostelAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.currency} {account.balance.toLocaleString('en-US')}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="To account" htmlFor="tr-to">
          <Select id="tr-to" value={toId} onChange={(event) => setToId(event.target.value)}>
            {hostelAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.currency} {account.balance.toLocaleString('en-US')}
              </option>
            ))}
          </Select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label={`Amount${from ? ` (${from.currency})` : ''}`} htmlFor="tr-amount">
            <Input id="tr-amount" type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} />
          </Field>
          <Field
            label={`Received${to ? ` (${to.currency})` : ''}`}
            htmlFor="tr-to-amount"
            hint={crossCurrency ? 'Converted amount' : 'Same currency'}
            className={crossCurrency ? '' : 'hidden'}
          >
            <Input id="tr-to-amount" type="number" min="0" value={toAmount} onChange={(event) => setToAmount(event.target.value)} />
          </Field>
        </div>
        <Field label="Note" htmlFor="tr-note">
          <Textarea id="tr-note" value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>

        {error ? <Callout tone="danger" title="Transfer not recorded">{error}</Callout> : null}

        <div className="flex items-center justify-between gap-2 border-t border-line pt-3">
          <p className="text-[11px] text-muted">
            {from ? <><Money amount={from.balance} currency={from.currency} size="sm" /> available</> : null}
          </p>
          <ActionButton onClick={submit} loading={busy}>Transfer</ActionButton>
        </div>
      </div>
    </Card>
  )
}
