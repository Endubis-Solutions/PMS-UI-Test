import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CreditCard, Receipt } from 'lucide-react'
import { bedLabel, bedRoom, TODAY } from '../data/core'
import { getFolio, chargesUsd } from '../data/folio'
import { fmtDate, initials, nights } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader, SectionTitle } from '../components/ui'
import { Avatar, Callout, Money } from '../components/feedback'
import { QrPanel } from '../components/qr'
import { ChargesCard } from './folio-charges'
import { SplitCard } from './folio-split'
import { RecordPaymentCard } from './folio-payment'

export default function Folio() {
  const { hostelBookings, hostelAccounts, notify } = useApp()
  const { pathname, query } = useRoute()
  const id = pathname.split('/')[2] || query.booking || 'BK-2419'
  const booking =
    hostelBookings.find((item) => item.id === id) ?? hostelBookings.find((item) => item.id === 'BK-2419')
  const state = query.state ?? 'default'
  const [extra, setExtra] = useState([])
  const [payments, setPayments] = useState([])
  const [qr, setQr] = useState(query.qr ?? 'idle')
  const [qrAmount, setQrAmount] = useState(0)
  const [retried, setRetried] = useState(false)

  useEffect(() => {
    if (query.qr) setQr(query.qr)
  }, [query.qr])

  const base = useMemo(() => getFolio(booking, bedRoom, nights), [booking])
  const lines = state === 'empty' ? [] : [...base.lines, ...extra]
  const charges = chargesUsd(lines, booking.currency)
  const paidBase = base.payments.reduce((sum, payment) => sum + payment.amount, 0)
  const paidManual = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const due = charges - paidBase - paidManual
  const settled = qr === 'paid'
  const totals = {
    charges,
    paid: paidBase + paidManual + (settled ? qrAmount : 0),
    balance: settled ? 0 : Math.max(0, due),
  }
  const account = hostelAccounts.find((item) => item.currency === booking?.currency)

  if (!booking) return null

  const recordPayment = ({ method, amount, accountId }) => {
    const target = hostelAccounts.find((item) => item.id === accountId)
    setPayments((current) => [
      ...current,
      { id: `pm-${Date.now()}`, date: TODAY, description: 'Front desk', amount, method },
    ])
    notify({
      title: 'Payment recorded',
      description: `${booking.currency} ${amount.toLocaleString('en-US')} · ${method} · ${target?.name ?? booking.guestName}`,
    })
  }

  const allPayments = [
    ...base.payments,
    ...payments,
    ...(settled ? [{ id: 'qr', date: TODAY, description: 'Stripe · QR', amount: qrAmount, method: 'Card' }] : []),
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Receipt}
        title="Folio"
        subtitle={`${booking.id} · ${booking.guestName} · ${bedRoom(booking.bed).name} · ${bedLabel(booking.bed)} · ${fmtDate(booking.start)} → ${fmtDate(booking.end)}`}
        actions={
          <>
            <ActionButton variant="secondary" icon={ArrowLeft} onClick={() => navigate('/calendar')}>
              Calendar
            </ActionButton>
            <ActionButton icon={CreditCard} onClick={() => document.getElementById('record-payment')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} disabled={totals.balance <= 0}>
              Take payment
            </ActionButton>
          </>
        }
      />

      {state === 'error' && !retried ? (
        <Callout
          tone="danger"
          title="Couldn’t load this folio"
          action={<ActionButton variant="secondary" size="sm" onClick={() => setRetried(true)}>Try again</ActionButton>}
        >
          Charges did not load. No payment has been taken.
        </Callout>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col gap-6">
          <ChargesCard
            booking={booking}
            lines={lines}
            payments={allPayments}
            totals={totals}
            loading={state === 'loading'}
            onAdd={(line) => {
              setExtra((current) => [...current, line])
              notify({
                title: 'Charge added',
                description: `${line.description} · ${booking.currency} ${line.amount.toLocaleString('en-US')}`,
              })
            }}
          />
          {totals.balance > 0 ? (
            <SplitCard
              booking={booking}
              balance={totals.balance}
              onSave={(payers) =>
                notify({
                  title: 'Split saved',
                  description: payers
                    .map((payer) => `${payer.name} ${booking.currency} ${payer.amount.toLocaleString('en-US')}`)
                    .join(' · '),
                })
              }
            />
          ) : (
            <Card className="p-4">
              <p className="text-[12px] font-medium text-ink">Folio settled</p>
              <p className="mt-0.5 text-[11px] text-muted">
                Nothing left to split. A new charge reopens the split panel.
              </p>
            </Card>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {totals.balance > 0 ? (
            <Card className="p-4" id="record-payment">
              <SectionTitle hint="Cash · card · M-Pesa">Record payment</SectionTitle>
              <div className="mt-3">
                <RecordPaymentCard
                  booking={booking}
                  balance={totals.balance}
                  accounts={hostelAccounts}
                  onRecord={recordPayment}
                />
              </div>
            </Card>
          ) : null}

          <Card className="p-4">
            <SectionTitle hint="Stripe Checkout">Pay by QR</SectionTitle>
            <div className="mt-3">
              <QrPanel
                state={state === 'loading' ? 'idle' : qr}
                amount={settled ? qrAmount : totals.balance}
                currency={booking.currency}
                reference={`QR-${booking.id.replace('BK-', '')}-01`}
                onCreate={() => {
                  setQrAmount(Math.max(0, due))
                  setQr('waiting')
                }}
                onCheck={() => {
                  const settledAmount = qrAmount || Math.max(0, due)
                  setQrAmount(settledAmount)
                  setQr('paid')
                  notify({
                    title: 'Payment received',
                    description: `${booking.currency} ${settledAmount.toLocaleString('en-US')} · ${booking.guestName}`,
                  })
                }}
                onRetry={() => setQr('waiting')}
              />
            </div>
            <p className="mt-3 text-[11px] leading-4 text-muted">
              Settles into {account?.name ?? 'the property cash account'} · {booking.currency}.
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-2.5">
              <Avatar initials={initials(booking.guestName)} size="sm" />
              <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-ink">{booking.guestName}</p>
                <p className="text-[11px] text-muted">{booking.country} · {booking.guests} guests</p>
              </div>
            </div>
            <dl className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3 text-[12px]">
              <div className="flex justify-between"><dt className="text-muted">Nights</dt><dd className="tnum">{nights(booking.start, booking.end)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Booking</dt><dd><Money amount={booking.amount} currency={booking.currency} size="sm" /></dd></div>
              <div className="flex justify-between"><dt className="text-muted">Balance</dt><dd><Money amount={totals.balance} currency={booking.currency} size="sm" className="font-semibold" /></dd></div>
            </dl>
            <button
              type="button"
              onClick={() => navigate(`/calendar?booking=${booking.id}`)}
              className="mt-3 text-[12px] font-medium text-primary hover:text-primary-hover"
            >
              Open booking
            </button>
          </Card>
        </div>

      </div>
    </div>
  )
}
