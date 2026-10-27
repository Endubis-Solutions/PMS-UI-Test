import { BadgeCheck } from 'lucide-react'
import { bedLabel, bedRoom } from '../data/core'
import { ActionButton } from './ui'
import { Money } from './feedback'

export function CheckInSuccess({ booking, payable, currency, account, user, onClose, onPrint }) {
  return (
    <>
      <div className="flex flex-col items-center py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/15">
          <BadgeCheck className="h-6 w-6 text-ink" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <p className="mt-3 text-[16px] font-semibold text-ink">{booking.guestName} is checked in</p>
        <p className="mt-1 text-[13px] text-muted">
          {bedRoom(booking.bed).name} · {bedLabel(booking.bed)} · by {user.name}
        </p>
        <div className="mt-4 w-full rounded-control border border-line bg-page p-3 text-left">
          <div className="flex justify-between text-[13px]">
            <span className="text-muted">Payment</span>
            <Money amount={payable} currency={currency} />
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span className="text-muted">Account</span>
            <span className="text-ink">{account?.name ?? 'No payment now'}</span>
          </div>
          <div className="mt-1 flex justify-between text-[13px]">
            <span className="text-muted">Receipt</span>
            <span className="tnum text-ink">RCP-{booking.id.replace('BK-', '')}</span>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <ActionButton variant="secondary" onClick={onPrint}>Print receipt</ActionButton>
        <ActionButton onClick={onClose}>Done</ActionButton>
      </div>
    </>
  )
}
