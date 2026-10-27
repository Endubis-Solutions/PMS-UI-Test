import { useMemo, useState } from 'react'
import { CURRENCIES, TODAY, bedLabel, isForeignCurrency } from '../data/core'
import { fmtLong, money } from '../lib/format'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { Modal } from './overlays'
import { ActionButton } from './ui'
import { Callout } from './feedback'
import { CheckInSummary } from './checkin-summary'
import { CheckInSuccess } from './checkin-success'
import { CheckInFields } from './checkin-fields'

export function CheckInModal({ bookingId, onClose }) {
  const { hostel, hostelAccounts, hostelBookings, updateBooking, addLedgerEntry, notify, user } = useApp()
  const { query } = useRoute()
  const booking = hostelBookings.find((item) => item.id === bookingId)
  const preset = query.state ?? 'default'
  const [form, setForm] = useState({
    amount: booking?.balance ?? 0,
    currency: booking?.currency ?? hostel.currency,
    method: 'Cash',
    accountId:
      preset === 'error'
        ? hostelAccounts.find((account) => account.currency === 'FCY')?.id ?? ''
        : isForeignCurrency(booking?.currency ?? hostel.currency)
          ? hostelAccounts.find((account) => account.currency === 'FCY')?.id ?? ''
          : hostelAccounts.find((account) => account.currency === hostel.currency)?.id ?? '',
    noPayment: booking?.balance === 0,
  })
  const [busy, setBusy] = useState(preset === 'processing')
  const [error, setError] = useState(
    preset === 'error'
      ? 'This account is in FCY. Choose a local account or record the payment in a foreign currency.'
      : null,
  )
  const [success, setSuccess] = useState(preset === 'success')
  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }))

  const options = useMemo(
    () => hostelAccounts.filter((account) => account.currency === (isForeignCurrency(form.currency) ? 'FCY' : form.currency)),
    [hostelAccounts, form.currency],
  )
  const account = hostelAccounts.find((item) => item.id === form.accountId)
  const payable = form.noPayment ? 0 : form.amount

  if (!booking) return null

  const submit = () => {
    setError(null)
    if (!form.noPayment && (!form.amount || form.amount <= 0)) {
      setError('Enter the amount received before checking in.')
      return
    }
    if (!form.noPayment && !form.accountId) {
      setError('Choose the account the money goes into.')
      return
    }
    if (!form.noPayment && account) {
      const fcyMatch = account.currency === 'FCY' && isForeignCurrency(form.currency)
      if (account.currency !== form.currency && !fcyMatch) {
        setError(
          `This account is in ${account.currency}. Choose a matching account or record the payment in the right currency.`,
        )
        return
      }
    }
    setBusy(true)
    window.setTimeout(() => {
      updateBooking(booking.id, {
        status: 'checked-in',
        balance: form.noPayment ? booking.balance : Math.max(0, booking.balance - payable),
      })
      if (!form.noPayment && payable > 0) {
        addLedgerEntry({
          id: `checkin-${booking.id}`,
          hostelId: booking.hostelId,
          date: TODAY,
          type: 'Income',
          category: 'Room booking',
          description: `${booking.guestName} · ${booking.id}`,
          amount: payable,
          currency: form.currency,
          method: form.method,
          accountId: form.accountId,
          recordedBy: user.name,
          guest: booking.guestName,
          ref: `TXN-${booking.id}`,
          createdAt: `${TODAY} 12:10`,
        })
      }
      setBusy(false)
      setSuccess(true)
      notify({
        title: 'Guest checked in',
        description: `${booking.guestName} · ${bedLabel(booking.bed)} · ${money(payable, form.currency)} recorded.`,
      })
    }, 650)
  }

  if (success) {
    return (
      <Modal open onClose={onClose} title="Checked in" width={520} label="Check-in complete">
        <CheckInSuccess
          booking={booking}
          payable={payable}
          currency={form.currency}
          account={account}
          user={user}
          onClose={onClose}
          onPrint={() => notify({ title: 'Receipt sent to the printer', description: 'Front desk · A4 receipt.' })}
        />
      </Modal>
    )
  }

  return (
    <Modal
      open
      onClose={onClose}
      title="Check in"
      subtitle={`${booking.id} · ${fmtLong(TODAY)}`}
      width={520}
      label={`Check in ${booking.guestName}`}
      footer={
        <div className="flex items-center justify-end gap-2">
          <ActionButton variant="secondary" onClick={onClose}>Cancel</ActionButton>
          <ActionButton onClick={submit} loading={busy}>
            {form.noPayment ? 'Check in without payment' : `Take ${money(payable, form.currency)}`}
          </ActionButton>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <CheckInSummary booking={booking} />
        {error ? <Callout tone="danger" title="Payment not recorded">{error}</Callout> : null}
        <CheckInFields
          form={form}
          set={set}
          booking={booking}
          user={user}
          hostel={hostel}
          options={options}
          account={account}
          staleAccount={account}
          error={error}
          disabled={busy}
        />
        {busy ? <p className="text-[12px] text-muted">Recording payment and checking the guest in…</p> : null}
      </div>
    </Modal>
  )
}
