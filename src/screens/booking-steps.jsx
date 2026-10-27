import { Check } from 'lucide-react'
import { Avatar, Badge, Callout } from '../components/feedback'
import { EmptyState } from '../components/feedback'
import { Card, SectionTitle, cx } from '../components/ui'
import { ActionButton } from '../components/ui'
import { Field, Input, Select } from '../components/form'
import { fmtDate, fmtDay, nights } from '../lib/format'
import { bedNumber } from '../data/core'
import { BedDouble } from 'lucide-react'

export function StepDates({ checkIn, setCheckIn, stay, setStay, source, setSource, start, end, freeCount, soldOut }) {
  return (
    <Card className="p-6">
      <SectionTitle>Stay dates and party</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Check in" htmlFor="nb-in">
          <Input id="nb-in" type="date" value={checkIn} onChange={(event) => setCheckIn(event.target.value)} />
        </Field>
        <Field label="Nights" htmlFor="nb-nights">
          <Input id="nb-nights" type="number" min="1" max="30" value={stay} onChange={(event) => setStay(Number(event.target.value))} />
        </Field>
        <Field label="Source" htmlFor="nb-source">
          <Select id="nb-source" value={source} onChange={(event) => setSource(event.target.value)}>
            <option value="walkin">Walk-in</option>
            <option value="direct">Direct website</option>
            <option value="phone">Phone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="booking">Booking.com</option>
            <option value="hostelworld">Hostelworld</option>
            <option value="expedia">Expedia</option>
          </Select>
        </Field>
      </div>
      <p className="mt-4 text-[12px] text-muted">
        {fmtDate(start)} → {fmtDate(end)} · {nights(start, end)} nights ·{' '}
        {soldOut ? 'no beds free for the whole stay.' : `${freeCount} ${freeCount === 1 ? 'bed' : 'beds'} free for the whole stay.`}
      </p>
    </Card>
  )
}

export function StepGuest({ guestName, setGuestName, country, setCountry, email, setEmail, phone, setPhone, guests, setGuests }) {
  return (
    <Card className="p-6">
      <SectionTitle hint="Lead guest">Guest information</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="nb-name" required>
          <Input id="nb-name" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Full name" />
        </Field>
        <Field label="Country" htmlFor="nb-country">
          <Input id="nb-country" value={country} onChange={(event) => setCountry(event.target.value)} placeholder="Country" />
        </Field>
        <Field label="Email" htmlFor="nb-email">
          <Input id="nb-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="guest@mail.com" />
        </Field>
        <Field label="Phone" htmlFor="nb-phone">
          <Input id="nb-phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+251 91 000 0000" />
        </Field>
        <Field label="Guests" htmlFor="nb-guests">
          <Input id="nb-guests" type="number" min="1" max="16" value={guests} onChange={(event) => setGuests(Number(event.target.value))} />
        </Field>
      </div>
    </Card>
  )
}

export function StepBeds({ dates, beds, taken, selected, toggleBed, freeBeds, partialBeds, setStep, soldOut }) {
  const noBeds = soldOut || freeBeds.length === 0
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <SectionTitle hint="Live availability">Choose beds</SectionTitle>
        <Badge tone="primary">{selected.length} selected</Badge>
      </div>
      {noBeds ? (
        <EmptyState
          icon={BedDouble}
          title="No beds for these dates"
          description="Every bed is taken or on hold for the whole stay. Shorten the stay or split the group across dates."
          action={<ActionButton variant="secondary" onClick={() => setStep(0)}>Change dates</ActionButton>}
        />
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="flex border-y border-line bg-page">
              <div className="w-[180px] shrink-0 px-6 py-2 text-label uppercase tracking-[0.08em] text-muted">Bed</div>
              {dates.map((date) => (
                <div key={date} className="w-[64px] shrink-0 py-2 text-center text-[10px] uppercase tracking-[0.06em] text-muted">
                  {fmtDay(date)}<br /><span className="tnum text-[12px] text-ink">{fmtDate(date)}</span>
                </div>
              ))}
            </div>
            {beds.map(({ bed, room }) => {
              const isSelected = selected.includes(bed)
              const free = dates.every((date) => !taken(bed, date))
              const partial = !free && dates.some((date) => !taken(bed, date))
              return (
                <button
                  key={bed}
                  type="button"
                  disabled={!free}
                  onClick={() => toggleBed(bed)}
                  className={cx(
                    'flex w-full items-center border-b border-line text-left transition-colors last:border-0',
                    free ? 'hover:bg-page' : 'cursor-not-allowed bg-page',
                  )}
                >
                  <div className="flex w-[180px] shrink-0 items-center gap-2 px-6 py-2">
                    <span className={cx('flex h-4 w-4 items-center justify-center rounded-[4px] border', isSelected ? 'border-primary bg-primary text-white' : 'border-line bg-card')}>
                      {isSelected ? <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> : null}
                    </span>
                    <span className="text-[13px] text-ink">{room.name} · Bed {bedNumber(bed)}</span>
                  </div>
                  {dates.map((date) => (
                    <div key={date} className="flex w-[64px] shrink-0 items-center justify-center py-2">
                      <span className={cx('h-2.5 w-2.5 rounded-full', taken(bed, date) ? 'bg-blocked' : 'bg-success')} aria-hidden="true" />
                    </div>
                  ))}
                  {!free ? <span className="ml-auto pr-4 text-[10px] text-muted">{partial ? 'Partial' : 'Taken'}</span> : null}
                </button>
              )
            })}
          </div>
        </div>
      )}
      {partialBeds.length && !noBeds ? (
        <div className="border-t border-line px-6 py-3">
          <Callout tone="info" title={`${partialBeds.length} beds are partly free`}>
            Partly free beds cannot be booked for the whole stay. Adjust the dates to use them.
          </Callout>
        </div>
      ) : null}
    </Card>
  )
}
