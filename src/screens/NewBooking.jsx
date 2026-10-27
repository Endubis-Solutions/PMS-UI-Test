import { useState } from 'react'
import { BedDouble } from 'lucide-react'
import { TODAY, bedParts, rateFor, roomsFor } from '../data/core'
import { addDays, datesFrom, fmtDate, nights } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader, SectionTitle } from '../components/ui'
import { Stepper } from '../components/tabs'
import { Callout, Money } from '../components/feedback'
import { StepBeds, StepDates, StepGuest } from './booking-steps'
import { StepDeposit } from './booking-steps2'

const STEPS = [
  { id: 'guest', label: 'Guest' },
  { id: 'dates', label: 'Dates' },
  { id: 'beds', label: 'Beds' },
  { id: 'deposit', label: 'Deposit' },
]

export default function NewBooking() {
  const { hostel, hostelId, hostelBookings, hostelHolds, hostelAccounts, addBooking, notify } = useApp()
  const { query } = useRoute()
  const soldOut = query.state === 'no-availability'
  const [step, setStep] = useState(Math.min(3, Number(query.step ?? 0)))
  const [guestName, setGuestName] = useState('')
  const [country, setCountry] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [guests, setGuests] = useState(1)
  const [checkIn, setCheckIn] = useState(TODAY)
  const [stay, setStay] = useState(3)
  const [source, setSource] = useState('walkin')
  const [selected, setSelected] = useState(soldOut ? [] : ['hawassa-E'])
  const [deposit, setDeposit] = useState(0)
  const [paidNow, setPaidNow] = useState(true)

  const start = checkIn
  const end = addDays(start, stay)
  const dates = datesFrom(start, stay)
  const beds = roomsFor(hostelId).flatMap((room) =>
    room.beds.map((letter) => ({ bed: `${room.id}-${letter}`, room, letter })),
  )
  const taken = (bed, date) =>
    hostelBookings.some((booking) => booking.bed === bed && booking.start <= date && booking.end > date) ||
    hostelHolds.some((hold) => hold.bed === bed && hold.start <= date && hold.end > date)
  const freeBeds = beds.filter(({ bed }) => dates.every((date) => !taken(bed, date)))
  const partialBeds = beds.filter(
    ({ bed }) => dates.some((date) => taken(bed, date)) && dates.some((date) => !taken(bed, date)),
  )
  const selectionValid = selected.every((bed) => dates.every((date) => !taken(bed, date)))
  const total = selectionValid ? deposit || selected.reduce((sum, bed) => sum + stay * rateFor(hostelId, bedParts(bed).roomId), 0) : 0

  const toggleBed = (bed) =>
    setSelected((current) =>
      current.includes(bed) ? current.filter((item) => item !== bed) : [...current, bed],
    )

  const create = () => {
    const id = `BK-${2500 + Math.floor(Math.random() * 400)}`
    const rate = selected.length ? rateFor(hostelId, bedParts(selected[0]).roomId) : 0
    addBooking({
      id,
      hostelId: hostel.id,
      guestName: guestName.trim() || 'Walk-in guest',
      source,
      status: 'reserved',
      bed: selected[0] ?? 'hawassa-A',
      start,
      end,
      amount: total,
      currency: 'USD',
      balance: total,
      rate,
      segments: [{ start, end, rate }],
      guests,
      country: country.trim() || '—',
      phone,
      email,
      notes: 'Created at the front desk.',
      createdAt: '2026-09-17 12:00',
      createdBy: 'Sara Bekele',
    })
    notify({
      title: 'Booking created',
      description: `${id} · ${selected.length} beds · ${fmtDate(start)} → ${fmtDate(end)}`,
    })
    navigate(`/calendar?checkin=${id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={BedDouble}
        title="New booking"
        subtitle={`Walk-in, phone or group · ${hostel.short} · USD`}
        actions={<ActionButton variant="secondary" onClick={() => navigate('/calendar')}>Cancel</ActionButton>}
      />

      <Stepper steps={STEPS} current={step} onStep={setStep} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex min-w-0 flex-col gap-4">
          {step === 0 ? (
            <StepGuest
              guestName={guestName}
              setGuestName={setGuestName}
              country={country}
              setCountry={setCountry}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              guests={guests}
              setGuests={setGuests}
            />
          ) : null}

          {step === 1 ? (
            <StepDates
              checkIn={checkIn}
              setCheckIn={setCheckIn}
              stay={stay}
              setStay={setStay}
              source={source}
              setSource={setSource}
              start={start}
              end={end}
              freeCount={freeBeds.length}
              soldOut={soldOut}
            />
          ) : null}

          {step === 2 ? (
            <StepBeds
              dates={dates}
              beds={beds}
              taken={taken}
              selected={selected}
              toggleBed={toggleBed}
              freeBeds={freeBeds}
              partialBeds={partialBeds}
              setStep={setStep}
              soldOut={soldOut}
            />
          ) : null}

          {step === 3 ? (
            <StepDeposit
              deposit={deposit}
              setDeposit={setDeposit}
              paidNow={paidNow}
              setPaidNow={setPaidNow}
              hostel={hostel}
              hostelAccounts={hostelAccounts}
            />
          ) : null}

          <div className="flex items-center justify-between gap-2">
            <ActionButton
              variant="secondary"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              disabled={step === 0}
            >
              Back
            </ActionButton>
            {step < 3 ? (
              <ActionButton
                onClick={() => setStep((value) => Math.min(3, value + 1))}
                disabled={(step === 0 && !guestName.trim()) || (step === 2 && (!selected.length || !selectionValid))}
              >
                Continue
              </ActionButton>
            ) : (
              <ActionButton onClick={create} disabled={!selected.length || !selectionValid || !guestName.trim()}>
                Create booking
              </ActionButton>
            )}
          </div>

        </div>
        <aside className="flex flex-col gap-4">
          <Card className="p-4">
            <SectionTitle>Summary</SectionTitle>
            <dl className="mt-3 flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between"><dt className="text-muted">Property</dt><dd className="text-ink">{hostel.short}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Guest</dt><dd className="text-ink">{guestName.trim() || '—'}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Stay</dt><dd className="tnum text-ink">{fmtDate(start)} → {fmtDate(end)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Nights</dt><dd className="tnum text-ink">{stay}</dd></div>
              <div className="flex justify-between"><dt className="text-muted">Beds</dt><dd className="tnum text-ink">{selected.length}</dd></div>
              <div className="flex justify-between border-t border-line pt-2">
                <dt className="text-muted">Total</dt>
                <dd><Money amount={total} currency="USD" className="font-semibold" /></dd>
              </div>
            </dl>
          </Card>
          {step === 2 && freeBeds.length === 0 ? (
            <Callout tone="warning" title="No availability">
              Try different dates, or add the guests to the waiting list from the dashboard.
            </Callout>
          ) : null}
          <Card className="p-4">
            <p className="text-label uppercase tracking-[0.08em] text-muted">At the desk</p>
            <ul className="mt-2 flex flex-col gap-1.5 text-[12px] text-muted">
              <li>Check the ID against the name.</li>
              <li>Confirm the bed number out loud.</li>
              <li>Payment is recorded against {hostel.short}.</li>
            </ul>
          </Card>
        </aside>

      </div>
    </div>
  )
}
