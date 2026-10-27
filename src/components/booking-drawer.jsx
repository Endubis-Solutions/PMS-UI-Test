import { useState } from 'react'
import { LogIn, Pencil, Search, UserX, XCircle } from 'lucide-react'
import { SOURCES, STATUS_STYLE, bedLabel, bedRoom } from '../data/core'
import { AUDIT } from '../data/ops'
import { getFolio } from '../data/folio'
import { addDays, fmtDate, initials, nights } from '../lib/format'
import { useApp } from '../lib/store'
import { useRoute } from '../lib/router'
import { Drawer, ConfirmDialog } from './overlays'
import { Avatar, Badge, Callout, EmptyState, Skeleton } from './feedback'
import { ActionButton, cx } from './ui'
import { Tabs } from './tabs'
import { BookingActivityTab, BookingDetailsTab, BookingFolioTab } from './booking-tabs'

export function BookingDrawer({ bookingId, initialTab, onClose, onCheckIn, onOpenFolio, onMove }) {
  const { hostelBookings, updateBooking, notify } = useApp()
  const { query } = useRoute()
  const booking = hostelBookings.find((item) => item.id === bookingId)
  const overlayState = query.state ?? 'default'
  const [tab, setTab] = useState(initialTab ?? 'details')
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({})
  const [confirm, setConfirm] = useState(null)

  if (!booking) return null
  const folio = getFolio(booking, bedRoom, nights)
  const group = booking.groupId ? hostelBookings.filter((item) => item.groupId === booking.groupId) : []
  const activity = AUDIT.filter(
    (entry) => entry.entity.includes(booking.id) || entry.entity.includes(booking.guestName),
  )
  const source = SOURCES[booking.source]

  const save = () => {
    const segments = (draft.segments ?? booking.segments ?? [{ start: booking.start, end: booking.end, rate: booking.rate }]).filter(
      (segment) => segment.start && segment.end && Number(segment.rate) > 0,
    )
    const amount = segments.reduce((sum, segment) => sum + nights(segment.start, segment.end) * Number(segment.rate), 0)
    const paid = booking.amount - booking.balance
    updateBooking(booking.id, {
      guestName: draft.guestName?.trim() || booking.guestName,
      phone: draft.phone,
      notes: draft.notes,
      segments,
      rate: Number(segments[0]?.rate ?? booking.rate),
      amount,
      balance: Math.max(0, amount - paid),
    })
    setEditing(false)
    notify({ title: 'Booking updated', description: 'Rate and details updated.' })
  }

  const decide = () => {
    const status = confirm === 'cancel' ? 'cancelled' : 'no-show'
    updateBooking(booking.id, { status })
    notify({
      tone: status === 'cancelled' ? 'warning' : 'info',
      title: status === 'cancelled' ? 'Booking cancelled' : 'Marked as no-show',
      description: `${booking.guestName} · ${bedLabel(booking.bed)} released back to inventory.`,
    })
    setConfirm(null)
    onClose()
  }

  const extendBooking = ({ days, rate, paid }) => {
    const segments = booking.segments ?? [{ start: booking.start, end: booking.end, rate: booking.rate }]
    const extensionRate = Number(rate)
    const newEnd = addDays(booking.end, days)
    const additional = days * extensionRate
    updateBooking(booking.id, {
      end: newEnd,
      segments: [...segments, { start: booking.end, end: newEnd, rate: extensionRate }],
      amount: booking.amount + additional,
      balance: Math.max(0, booking.balance + additional - paid),
    })
    notify({
      title: 'Booking extended',
      description: `${booking.guestName} · +${days} ${days === 1 ? 'night' : 'nights'} @ ${booking.currency} ${extensionRate.toLocaleString('en-US')} · new check-out ${fmtDate(newEnd)}${
        paid > 0 ? ` · ${booking.currency} ${paid.toLocaleString('en-US')} paid` : ' · not paid yet'
      }`,
    })
  }

  return (
    <>
      <Drawer
        open
        onClose={onClose}
        width={480}
        header={
          overlayState === 'empty' ? (
            <div>
              <h2 className="text-[18px] font-semibold leading-6 text-ink">Booking not found</h2>
              <p className="mt-0.5 text-[12px] text-muted">No booking with this reference in this property.</p>
            </div>
          ) : (
          <div className="flex items-start gap-3">
            <Avatar initials={initials(booking.guestName)} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-[18px] font-semibold leading-6 text-ink">{booking.guestName}</h2>
              <p className="mt-0.5 text-[12px] text-muted">{booking.id} · {booking.country}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  tone={booking.status === 'checked-in' ? 'success' : booking.status === 'reserved' ? 'primary' : 'blocked'}
                  dot
                >
                  {STATUS_STYLE[booking.status].label}
                </Badge>
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted">
                  <span className={cx('h-2 w-2 rounded-full', source.dot)} aria-hidden="true" />
                  {source.label}
                </span>
              </div>
            </div>
          </div>
          )
        }
        tabs={
          overlayState === 'empty' ? null : (
          <Tabs
            tabs={[
              { id: 'details', label: 'Details' },
              { id: 'folio', label: 'Folio', count: folio.lines.length },
              { id: 'activity', label: 'Activity', count: activity.length },
            ]}
            value={tab}
            onChange={setTab}
          />
          )
        }
        footer={
          overlayState === 'empty' ? null : (
          <div className="flex flex-col gap-2">
            <ActionButton
              icon={LogIn}
              onClick={() => onCheckIn(booking.id)}
              disabled={booking.status !== 'reserved'}
            >
              {booking.status === 'checked-in' ? 'Already checked in' : 'Check in'}
            </ActionButton>
            <div className="grid grid-cols-2 gap-2">
              <ActionButton
                variant="secondary"
                size="sm"
                icon={Pencil}
                onClick={() => {
                  setDraft({
                    guestName: booking.guestName,
                    phone: booking.phone,
                    notes: booking.notes,
                    segments: booking.segments ?? [{ start: booking.start, end: booking.end, rate: booking.rate }],
                  })
                  setEditing(true)
                  setTab('details')
                }}
              >
                Edit
              </ActionButton>
              <ActionButton variant="secondary" size="sm" onClick={() => { onMove(); onClose() }}>
                Move bed
              </ActionButton>
              <ActionButton variant="danger" size="sm" icon={XCircle} onClick={() => setConfirm('cancel')}>
                Cancel
              </ActionButton>
              <ActionButton variant="danger" size="sm" icon={UserX} onClick={() => setConfirm('noshow')}>
                Mark no-show
              </ActionButton>
            </div>
          </div>
          )
        }
      >
        {overlayState === 'loading' ? (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : overlayState === 'error' ? (
          <Callout tone="danger" title="Couldn’t load this booking">
            The booking did not load. Nothing has been changed; close the drawer and try again.
          </Callout>
        ) : overlayState === 'empty' ? (
          <EmptyState
            icon={Search}
            title="Booking not found"
            description="This reference does not exist in this property. It may have been cancelled and archived."
            compact
          />
        ) : tab === 'details' ? (
          <BookingDetailsTab
            booking={booking}
            folio={folio}
            group={group}
            editing={editing}
            draft={draft}
            setDraft={setDraft}
            onCancelEdit={() => setEditing(false)}
            onSave={save}
            onExtend={extendBooking}
          />
        ) : tab === 'folio' ? (
          <BookingFolioTab
            booking={booking}
            folio={folio}
            onOpenFolio={onOpenFolio}
            onAddCharge={(line) =>
              notify({
                title: 'Charge added',
                description: `${line.description} · ${booking.currency} ${line.amount.toLocaleString('en-US')}`,
              })
            }
          />
        ) : (
          <BookingActivityTab activity={activity} />
        )}

      </Drawer>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={decide}
        title={confirm === 'cancel' ? 'Cancel this booking?' : 'Mark as no-show?'}
        confirmLabel={confirm === 'cancel' ? 'Cancel booking' : 'Mark no-show'}
        description={
          confirm === 'cancel'
            ? `Release ${bedLabel(booking.bed)} for ${booking.guestName}. The audit log keeps the record.`
            : `${booking.guestName} did not arrive. The bed is released for tonight.`
        }
      />
    </>
  )
}
