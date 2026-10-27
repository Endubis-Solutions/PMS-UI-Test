import { CheckCircle2, RefreshCw, XCircle } from 'lucide-react'
import { ActionButton } from './ui'
import { Money, Spinner } from './feedback'

const N = 21

function isFinder(row, col) {
  return (row < 7 && col < 7) || (row < 7 && col >= N - 7) || (row >= N - 7 && col < 7)
}

function finderCell(row, col) {
  const r = row >= N - 7 ? row - (N - 7) : row
  const c = col >= N - 7 ? col - (N - 7) : col
  const edge = r === 0 || r === 6 || c === 0 || c === 6
  const core = r >= 2 && r <= 4 && c >= 2 && c <= 4
  return edge || core
}

function PseudoQR({ size = 176 }) {
  const cells = []
  for (let row = 0; row < N; row += 1) {
    for (let col = 0; col < N; col += 1) {
      const dark = isFinder(row, col)
        ? finderCell(row, col)
        : (row * 7 + col * 11 + ((row * col) % 5)) % 7 < 3
      cells.push(dark)
    }
  }
  return (
    <div
      className="grid overflow-hidden rounded-[6px] border border-line bg-card p-2"
      style={{ gridTemplateColumns: `repeat(${N}, 1fr)`, width: size, height: size }}
      role="img"
      aria-label="Payment QR code"
    >
      {cells.map((dark, index) => (
        <span key={index} className={dark ? 'bg-ink' : 'bg-card'} />
      ))}
    </div>
  )
}

export function QrPanel({ state, amount, currency, reference, onCreate, onCheck, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-control border border-line bg-page p-4 text-center">
      {state === 'waiting' ? (
        <>
          <PseudoQR />
          <div className="flex items-center gap-2 text-[12px] font-medium text-ink">
            <Spinner /> Waiting for the guest to pay
          </div>
          <p className="text-[11px] text-muted">Stripe Checkout · expires in 10 minutes</p>
          <ActionButton variant="secondary" size="sm" icon={RefreshCw} onClick={onCheck}>
            Check payment status
          </ActionButton>
        </>
      ) : null}

      {state === 'paid' ? (
        <>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-[14px] font-semibold text-ink">Payment received</p>
          <Money amount={amount} currency={currency} size="lg" className="font-semibold text-ink" />
          <p className="text-[11px] text-muted">Reference {reference}</p>
          <ActionButton variant="secondary" size="sm" onClick={onCreate}>
            New QR
          </ActionButton>
        </>
      ) : null}

      {state === 'failed' ? (
        <>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-danger/10">
            <XCircle className="h-6 w-6 text-danger" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <p className="text-[14px] font-semibold text-ink">Payment failed</p>
          <p className="max-w-[34ch] text-[12px] leading-5 text-muted">
            The guest’s card was declined. The folio balance is unchanged — create a new QR to retry.
          </p>
          <ActionButton size="sm" onClick={onRetry}>Create a new QR</ActionButton>
        </>
      ) : null}

      {state === 'idle' ? (
        <>
          <PseudoQR />
          <Money amount={amount} currency={currency} size="lg" className="font-semibold text-ink" />
          <p className="max-w-[34ch] text-[12px] leading-5 text-muted">
            Show this code to the guest. It opens a Stripe Checkout page for the folio balance only.
          </p>
          <ActionButton size="sm" onClick={onCreate}>Create QR for {currency} {amount.toLocaleString('en-US')}</ActionButton>
        </>
      ) : null}
    </div>
  )
}
