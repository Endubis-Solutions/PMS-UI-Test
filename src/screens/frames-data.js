export const FRAMES = [
  { id: 'S1', title: 'Login', path: '/login', states: [['default', 'Default'], ['loading', 'Signing in'], ['empty', 'Empty submission'], ['error', 'Wrong password']] },
  { id: 'S2', title: 'Dashboard', path: '/dashboard', states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'No arrivals'], ['error', 'Error']] },
  {
    id: 'S3',
    title: 'Bed timeline',
    path: '/calendar',
    states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'No stays'], ['error', 'Error'], ['tooltip', 'Pill tooltip'], ['dragging', 'Drag · valid'], ['drag-invalid', 'Drag · occupied'], ['group', 'Group booking'], ['hold', 'Maintenance hold']],
  },
  {
    id: 'S4',
    title: 'Booking detail',
    path: '/calendar?booking=BK-2419',
    states: [['default', 'Details'], ['&tab=folio', 'Folio'], ['&tab=activity', 'Activity'], ['state=loading', 'Loading'], ['state=error', 'Error'], ['state=empty', 'Not found']],
  },
  {
    id: 'S5',
    title: 'Check-in with payment',
    path: '/calendar?checkin=BK-2419',
    states: [['default', 'Default'], ['state=processing', 'Processing'], ['state=error', 'Currency mismatch'], ['state=success', 'Success']],
  },
  {
    id: 'S6',
    title: 'New booking',
    path: '/new-booking',
    states: [['default', 'Step 1 · guest'], ['step=1', 'Step 2 · dates'], ['step=2', 'Step 3 · beds'], ['step=3', 'Step 4 · deposit'], ['step=2&state=no-availability', 'No availability']],
  },
  {
    id: 'S7',
    title: 'Guests',
    path: '/guests',
    states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Error'], ['guest=g1', 'Guest profile']],
  },
  {
    id: 'S8',
    title: 'Folio',
    path: '/folio/BK-2419',
    states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'No charges'], ['error', 'Error'], ['qr=waiting', 'QR waiting'], ['qr=paid', 'QR paid'], ['qr=failed', 'QR failed']],
  },
  {
    id: 'S9',
    title: 'Admin finance',
    path: '/finance',
    states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Error'], ['preset=laundry-last-month', 'Filtered'], ['preset=filtered-empty', 'Filtered empty']],
  },
  { id: 'S9b', title: 'Transfers', path: '/finance/transfers', states: [['default', 'Default'], ['state=insufficient', 'Insufficient balance']] },
  { id: 'S10', title: 'Reports', path: '/reports', states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Error']] },
  {
    id: 'S11',
    title: 'Pricing & inventory',
    path: '/rates',
    states: [['default', 'Default'], ['loading', 'Loading'], ['empty', 'Empty'], ['error', 'Error'], ['state=hold', 'Hold drawer']],
  },
  {
    id: 'S12',
    title: 'Finance entry',
    path: '/finance-entry',
    states: [['default', 'Default'], ['state=loading', 'Loading'], ['state=error', 'Error'], ['state=filled', 'Filled'], ['state=submitted', 'Submitted'], ['state=empty', 'No entries today']],
  },
  { id: 'Logs', title: 'Logs', path: '/logs', states: [['default', 'Default']] },
]

export const JOURNEYS = [
  { id: 'a', title: 'Walk-in', detail: 'Timeline → new booking (4 steps) → check-in with payment.', start: '/calendar' },
  { id: 'b', title: 'Staff logs income', detail: 'Finance entry → backdate to yesterday → Bar → “2 Beers” → submit.', start: '/finance-entry' },
  { id: 'c', title: 'Bulk pricing update', detail: 'Pricing → Double Room (Bale) → next month range → set 1-pax and 2-pax → apply.', start: '/rates' },
  { id: 'd', title: 'Admin export', detail: 'Switch to Nairobi → filter Laundry · last month → export CSV.', start: '/finance?preset=laundry-last-month' },
]
