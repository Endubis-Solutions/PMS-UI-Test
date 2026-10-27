# Mad Vervet PMS — desktop prototype

A static React + Tailwind v3 prototype of the staff/admin PMS described in the brief:
bed-level reservations, check-in with payment, guest folios, and separated finance logs for
two properties. All bookings are direct/manual — there are no OTAs.

## Run

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

No network calls, no backend, no persistence: every booking, ledger row, and account balance
is mock data in `src/data/`.

## Entry points

- `/login` — sign in as staff (Addis Ababa, locked) or admin (both properties).
- `/frames` — the frame index: all 12 screens, every listed state, and the four journeys.
- `/styleguide` — the Tokens sheet and the component sheet.
- `/frames` is public. Every other route requires a session.

For direct frames or screenshots, `?demo=staff` or `?demo=admin` boots a session, and
`?hostel=nairobi` boots the other property:

```
/#/finance?demo=admin&hostel=nairobi
/#/calendar?demo=staff&state=dragging
```

## Structure

```
src/
  data/          mock world: hostels, named rooms, bookings, ledger, guests, reports
  lib/           format helpers, hash router, app store (auth, hostel, money)
  components/    TopNav, PropertyChip, AlertBanner, PageHeader, StatCard, DataTable,
                 BookingPill, BlockedCell, Drawer, FilterBar, Toast, Skeleton, ...
  screens/       S1–S12, Logs, StyleGuide, Frames
```

`PRODUCT.md` records product truth and data rules. `DESIGN.md` records the Tokens block and
the component/state contract.

## Notes

- Amounts are never converted or summed across currencies; accounts and ledgers are filtered
  by the selected hostel before they reach a screen.
- Status is never colour-only: pills are labelled in the drawer and legend, blocked cells carry
  a lock and the word Maintenance.
- The source palette is Direct website, Walk-in, Phone and WhatsApp. Phone reuses the warning
  colour and WhatsApp reuses the primary colour — no new hex values are introduced.
