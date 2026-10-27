# Mad Vervet PMS — Product Truth

## Product

A desktop web app that runs a bed-level hostel: reservations, check-in, payments, guest
folios, and day-to-day money logging. All bookings are direct and manual — there are no
OTAs and no OTA syncing. Detailed analytics are offloaded to an external ERP; the PMS
records clean transactions and exports them as CSV.

## Users

| User | Situation | Job to be done |
|---|---|---|
| Front-desk staff | One property, shared reception desk, constantly interrupted, mouse + keyboard | Place a walk-in in the right bed, check guests in, take payment, log daily income and expenses |
| Admin / owner | Both properties, daily review and weekly reconciliation | Read occupancy and revenue, correct bookings, reconcile accounts, export to the ERP |

Staff work under time pressure with a guest standing in front of them. Every screen must
answer three questions in under two seconds: which hostel am I in, what is the state of
the beds, and what money is attached.

## Mechanism

- One **bed-by-date timeline** is the single source of truth for allocation. Rooms group
  rows; each bed is its own lettered row; a booking is one pill spanning its nights.
- Every booking carries a **source channel** that never changes: Direct website, Walk-in,
  Phone, WhatsApp.
- **Pill colour encodes booking status** (reserved / checked-in / checked-out); the source
  is a small round badge before the guest name. Status and source are never conflated.
- Money is recorded against an **account owned by one hostel, in that account's own
  currency**. The account list in any payment form is filtered to the current hostel and
  the selected currency, so a mismatch is caught before it is written.
- **Maintenance holds** block a bed without a guest; blocked cells are hatched, never
  coloured like a stay.

## Roles and access

| Capability | Staff | Admin |
|---|---|---|
| Hostel scope | Locked to one hostel, switcher hidden | Both hostels, switcher visible |
| Dashboard, Calendar, Guests, Finance Entry | Yes | Yes |
| Reports, Admin Finance, Pricing, Logs | No (hidden) | Yes |

The demo credentials in the prototype are staff (Addis Ababa) and admin (both).

## Data rules (non-negotiable)

1. **Financial data is strictly separated by the selected hostel.** A ledger row, account,
   balance, or export never mixes hostels.
2. **Amounts in different currencies are never summed.** Each account card carries its own
   currency; there is no blended total.
3. **No double booking.** A bed cannot hold two overlapping stays.
4. **Audit is append-only.** Booking creation, edits, cancellations, check-ins, payments,
   transfers and no-shows record actor, time, and source.
5. **The hostel chip is on every screen**, including login. The two properties must be
   impossible to confuse.
6. Every money amount is shown with its currency code.

## Scope — v3.0 desktop design

S1 Login · S2 Dashboard · S3 Bed timeline · S4 Booking detail drawer · S5 Check-in with
payment · S6 New booking / walk-in / group · S7 Guests · S8 Folio · S9 Admin finance +
Transfers · S10 Reports · S11 Pricing & inventory · S12 Finance entry.

Explicitly **out** of scope: chat inbox, reviews, HR, events, housekeeping app, kiosk.

## Constraints

- Use only the Tokens block in `DESIGN.md`; invent no colour, size, or radius.
- No dark mode, no gradients, no stock photography or illustration in staff screens,
  no animation longer than 200 ms, no lorem ipsum.
- Long forms are pages or drawers; S5 is the only modal.
- Desktop 1440×900, laptop-first, mouse and keyboard.
- Body and placeholder text ≥ 4.5:1 contrast; 2 px primary focus ring; 44×44 targets.
- Static mock data only, no network calls, no persistence beyond the session.

## Fixed sample world

Two hostels: **Mad Vervet Addis Ababa** (ETB) and **Mad Vervet Nairobi** (KES).

- Addis Ababa: 8-Bed Mixed Dorm (Hawassa), 8-Bed Mixed Dorm En-suite (Lalibela), 6-Bed
  Female Dorm, Single Rooms (Denakil, Gondar), Double Rooms (BahirDar, Omo, Bale, Axum).
- Nairobi: 4-Bed Mixed Dorm (Masai Mara, Kisumu), 4-Bed Mixed Dorm Deluxe (Turkana),
  4-Bed Female Dorm (Naivasha), Double Private Rooms (Nakuru, Amboseli).

Fixed today: **Thursday 17 September 2026**.

## Stack

React 18 + Vite + Tailwind CSS v3 + lucide-react icons, hash routing, mock data modules.
The brief prescribes React + Tailwind v3 for any code output, so the stack is confirmed by
the brief rather than delegated.

## Platform

web
