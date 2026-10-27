import { useMemo, useState } from 'react'
import { Plus, Users } from 'lucide-react'
import { fmtDate, initials } from '../lib/format'
import { useApp } from '../lib/store'
import { navigate, useRoute } from '../lib/router'
import { ActionButton, Card, PageHeader } from '../components/ui'
import { DataTable, SearchInput } from '../components/table'
import { Avatar, Badge, Callout, EmptyState, Money, Skeleton } from '../components/feedback'
import { GuestDrawer } from '../components/guest-drawer'

export default function Guests() {
  const { guests, hostelBookings, notify } = useApp()
  const { query } = useRoute()
  const state = query.state ?? 'default'
  const [search, setSearch] = useState('')
  const [created, setCreated] = useState([])
  const [newOpen, setNewOpen] = useState(false)

  const all = useMemo(() => [...created, ...guests], [created, guests])
  const rows = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return all
    return all.filter((guest) =>
      [guest.name, guest.country, guest.email, guest.phone].some((value) =>
        String(value ?? '').toLowerCase().includes(term),
      ),
    )
  }, [all, search])
  const selected = all.find((guest) => guest.id === query.guest)

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={Users}
        title="Guests"
        subtitle={`${all.length} guest profiles · search by name, country, phone or email.`}
        actions={
          <>
            <SearchInput value={search} onChange={setSearch} className="w-[260px]" />
            <ActionButton icon={Plus} onClick={() => setNewOpen(true)}>Add guest</ActionButton>
          </>
        }
      />

      {state === 'error' ? (
        <Callout tone="danger" title="Couldn’t load guests">
          The guest list did not load. Bookings and folios are unaffected.
        </Callout>
      ) : null}

      <Card className="overflow-hidden">
        {state === 'loading' ? (
          <div className="divide-y divide-line">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-6 py-4">
                <Skeleton variant="circle" className="h-9 w-9" />
                <Skeleton className="h-3 w-40" />
                <Skeleton className="ml-auto h-3 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <DataTable
            rows={rows}
            minWidth={900}
            onRowClick={(row) => navigate(`/guests?guest=${row.id}`)}
            empty={
              <EmptyState
                icon={Users}
                title={search ? 'No guests match that search' : 'No guest profiles yet'}
                description={
                  search
                    ? `Nothing found for “${search}”. Try a surname, a country, or a phone number.`
                    : 'Guest profiles are created automatically with the first booking.'
                }
                action={
                  search ? (
                    <ActionButton variant="secondary" onClick={() => setSearch('')}>Clear search</ActionButton>
                  ) : (
                    <ActionButton onClick={() => setNewOpen(true)}>Add guest</ActionButton>
                  )
                }
              />
            }
            columns={[
              {
                key: 'name',
                header: 'Guest',
                width: 240,
                render: (row) => (
                  <div className="flex items-center gap-3">
                    <Avatar initials={initials(row.name)} />
                    <div>
                      <p className="font-medium text-ink">{row.name}</p>
                      <p className="text-[11px] text-muted">{row.country}</p>
                    </div>
                  </div>
                ),
              },
              {
                key: 'contact',
                header: 'Contact',
                width: 220,
                render: (row) => (
                  <div>
                    <p className="tnum text-[13px] text-ink">{row.phone}</p>
                    <p className="text-[11px] text-muted">{row.email}</p>
                  </div>
                ),
              },
              {
                key: 'stays',
                header: 'Stays',
                width: 110,
                render: (row) => (
                  <span className="tnum text-[13px]">
                    {row.stays} <span className="text-muted">· {row.nights}n</span>
                  </span>
                ),
              },
              {
                key: 'last',
                header: 'Last stay',
                width: 120,
                render: (row) => <span className="tnum text-[13px]">{fmtDate(row.lastStay)}</span>,
              },
              {
                key: 'balance',
                header: 'Balance',
                align: 'right',
                width: 130,
                render: (row) =>
                  row.balance > 0 ? (
                    <Money amount={row.balance} currency={row.currency} className="font-medium" />
                  ) : (
                    <Badge tone="success" dot>Paid</Badge>
                  ),
              },
            ]}
          />
        )}
      </Card>

      <GuestDrawer
        guest={selected}
        isNew={newOpen}
        bookings={hostelBookings}
        onClose={() => {
          setNewOpen(false)
          if (query.guest) navigate('/guests')
        }}
        onCreate={(guest) => {
          setCreated((current) => [guest, ...current])
          setNewOpen(false)
          notify({ title: 'Guest added', description: `${guest.name} can now be attached to a booking.` })
          navigate(`/guests?guest=${guest.id}`)
        }}
        onNewBooking={() => navigate('/new-booking')}
        onOpenFolio={(id) => navigate(`/folio/${id}`)}
      />
    </div>
  )
}
