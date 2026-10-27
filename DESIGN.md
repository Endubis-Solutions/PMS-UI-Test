# Mad Vervet PMS — Design System

Mode: **Operate**. Ambition shows as precision and restraint. The visual world is pinned
by the brief to the Hostelmate demo and by the Tokens block below. Nothing in this file may
be extended without the user changing the brief.

## Tokens (the only permitted values)

```
Font: Inter, fallback system-ui. Sizes: page title 24/600, body 14/400, table text 14,
  section label 11/500 UPPERCASE letter-spacing 0.08em, big stat number 36/700.
Colors: primary #2563EB (hover #1D4ED8), primary tint #EFF6FF, page background #F8FAFC,
  card #FFFFFF, border #E5E7EB, text #111827, secondary text #6B7280, success #10B981,
  warning #F59E0B, danger #DC2626, blocked #9CA3AF with 45-degree hatch pattern.
Booking status colors (pill fill): reserved #38BDF8, checked-in #34D399,
  checked-out #9CA3AF. Pill color = status; a small round badge before the guest name = source.
Source badge colors: Direct website #10B981, Walk-in #6B7280, Phone #F59E0B, WhatsApp #2563EB.
Shape: 8px radius on buttons, inputs, pills; 12px on cards. 4px spacing grid; card padding 24px.
Accessibility: text contrast at least 4.5:1, visible 2px primary focus ring, touch targets
  at least 44x44px.
Global rules: the current hostel name is always visible on every screen (top bar chip).
  Every money amount is shown with its currency code (ETB, USD, EUR, KES). Amounts in
  different currencies are never summed together. No dark mode, no gradients, no stock
  photos or illustrations in staff screens, no animation longer than 200ms, no lorem ipsum.
Sample data: two hostels, Addis Ababa and Nairobi, with named rooms and beds. All bookings
  are direct/manual (Direct website, Walk-in, Phone, WhatsApp); there are no OTAs.
```

The brief removes OTAs, so the source palette above is the no-OTA set: Direct website and
Walk-in keep their colours, while Phone reuses the warning colour and WhatsApp reuses the
primary colour — no new hex value is introduced.

Token → Tailwind mapping (single source: `tailwind.config.js`):

| Token | Utility |
|---|---|
| primary / hover / tint | `primary`, `primary-hover`, `tint` |
| page / card / border | `page`, `card`, `line` |
| text / secondary | `ink`, `muted` |
| success / warning / danger / blocked | `success`, `warning`, `danger`, `blocked` |
| status fills | `status-reserved`, `status-checkedin`, `status-checkedout` |
| source dots | `source-direct`, `source-walkin`, `source-phone`, `source-whatsapp` |

Only white (`#FFFFFF`, the card token) and the values above may appear in the interface.
Opacity is permitted only on these values (hatch lines, tinted column, disabled states).

## Typography

- Inter self-hosted (400/500/600/700). Nothing else, including numerals.
- Page title 24/600 · subtitle 14/400 muted · body/table 14/400 · label 11/500 uppercase
  0.08em · stat 36/700.
- Amounts and counts use `tabular-nums`. Dates use the same face; never monospace.
- Measure: form and copy blocks cap at 68ch. Table cells never wrap a name mid-word.

## Shape, depth, spacing

- Radius: 8 px controls and pills, 12 px cards, 999 px status dots and avatars.
- Depth: 1 px `line` border on every card; shadows only for overlays — `raised` (menus,
  popovers), `drawer` (right sheet). No glow, no hard offset shadows.
- Spacing on a 4 px grid: 24 px page gutter at 1440, 16 px between controls, 24 px card
  padding, 32 px between page sections.
- Nested cards are forbidden. A table inside a card is the deepest container.

## Layout

- Top nav 64 px, white, 1 px bottom border. Logo + wordmark left, `PropertyChip` +
  currency selector next, page links right, overflow menu last.
- Page: 1440 max, 24 px gutter, `PageHeader` (40 px tinted icon badge, title, subtitle,
  right-aligned context controls), then sections.
- Timeline: sticky 200 px bed rail, 44 px day columns, sticky date header, today column
  tinted with a 2 px primary top rule. Rooms are grouped by name; each bed is a lettered row.
- Drawers: 480 px right sheet. Modal: 520 px, S5 only. Long forms are pages.

## Components

`TopNav`, `PageHeader`, `StatCard`, `SegmentedCounter`, `DataTable`, `SourceBadge`,
`StatusDropdown`, `ActionButton`, `BookingPill`, `BlockedCell` are named by the brief.
Introduced and specified here:

| Component | States / variants |
|---|---|
| `PropertyChip` | admin (switcher, both hostels), staff (locked, lock icon, no menu) |
| `AlertBanner` | warning, danger, info |
| `Drawer` | right sheet, 480 px, header/tabs/body/footer, Esc + scrim close |
| `FilterBar` | inline selects, active-filter chips, clear all, result count |
| `Toast` | success, info, warning, danger; 4 s; one at a time |
| `ConfirmDialog` | destructive confirm, cancel/confirm, reason field |
| `EmptyState` | icon, title, one line, primary action |
| `Skeleton` | line, block, table rows, stat card; no shimmer |

Every component ships its full variant set on `/styleguide`.

## States

Each screen implements default, loading (skeleton shaped like the content), empty, error
(with a recovery action), plus its listed extras. Loading never replaces the nav or the
hostel chip. Errors name the problem and the recovery, never "Something went wrong".

## Motion

150 ms ease-out for hovers, focus, drawers (200 ms), toasts (150 ms in, 120 ms out).
No entrance animation on page load, no parallax, nothing that delays information.

## Accessibility

- Focus: 2 px primary outline, 2 px offset, on every interactive element; `:focus-visible`.
- Status is never colour-only: pills carry the guest name and a status label in the drawer,
  blocked cells carry a lock icon, source dots carry a text label in tables.
- Timeline cells and icon-only buttons have accessible names.
- Target size ≥ 44×44 for row actions and nav items.
