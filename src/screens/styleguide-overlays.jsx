import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { AlertBanner, PropertyChip } from '../components/property'
import { Card, SectionTitle, ActionButton } from '../components/ui'
import { Drawer, ConfirmDialog } from '../components/overlays'
import { FilterBar } from '../components/table'
import { Field, Input, Select } from '../components/form'
import { EmptyState } from '../components/feedback'

export function NavSheet() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-6">
        <SectionTitle hint="Admin and staff">PropertyChip</SectionTitle>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <PropertyChip />
          <PropertyChip locked />
        </div>
        <p className="mt-3 text-[11px] text-muted">
          Staff see a lock and no menu. Admin sees both properties and the currency of each.
        </p>
      </Card>

      <Card className="overflow-hidden">
        <div className="px-6 pb-2 pt-6"><SectionTitle>AlertBanner</SectionTitle></div>
        <div className="border-t border-line">
          <AlertBanner
            title="3 beds are on maintenance hold"
            description="Release them from Pricing & inventory when the work is done."
          />
        </div>
        <div className="px-6 py-3">
          <p className="flex items-center gap-2 text-[11px] text-muted">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            Warning, danger and info variants, used for property-level notices.
          </p>
        </div>
      </Card>
    </div>
  )
}

export function FieldsSheet() {
  return (
    <Card className="p-6">
      <SectionTitle hint="Labels are 11 px uppercase">Field, Input, Select</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Guest name" htmlFor="sg-name" hint="As shown on the passport.">
          <Input id="sg-name" defaultValue="Mei Tanaka" />
        </Field>
        <Field label="Currency" htmlFor="sg-currency">
          <Select id="sg-currency" defaultValue="ETB">
            <option>ETB</option>
            <option>USD</option>
            <option>KES</option>
          </Select>
        </Field>
        <Field label="Amount" htmlFor="sg-amount" error="Enter an amount greater than zero.">
          <Input id="sg-amount" defaultValue="0" invalid />
        </Field>
        <Field label="Checked in by" htmlFor="sg-by">
          <Input id="sg-by" defaultValue="Sara Bekele" readOnly className="bg-page" />
        </Field>
      </div>
    </Card>
  )
}

export function OverlaySheet() {
  const [drawer, setDrawer] = useState(false)
  const [confirm, setConfirm] = useState(false)
  return (
    <Card className="p-6">
      <SectionTitle hint="S5 is the only modal">Drawer and ConfirmDialog</SectionTitle>
      <div className="mt-4 flex flex-wrap gap-2">
        <ActionButton variant="secondary" onClick={() => setDrawer(true)}>Open drawer</ActionButton>
        <ActionButton variant="danger" onClick={() => setConfirm(true)}>Confirm dialog</ActionButton>
      </div>
      <div className="mt-4">
        <FilterBar resultCount={4} resultLabel="stays">
          <div className="w-[160px]">
            <Field label="Room" htmlFor="sg-room">
              <Select id="sg-room" defaultValue="all">
                <option value="all">All rooms</option>
                <option value="hawassa">Hawassa</option>
              </Select>
            </Field>
          </div>
          <div className="w-[150px]">
            <Field label="Source" htmlFor="sg-source">
              <Select id="sg-source" defaultValue="all">
                <option value="all">All sources</option>
                <option value="direct">Direct website</option>
              </Select>
            </Field>
          </div>
        </FilterBar>
      </div>
      <div className="mt-4">
        <EmptyState
          icon={AlertTriangle}
          title="EmptyState inside a card"
          description="No records match this view yet."
          compact
        />
      </div>

      <Drawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title="Drawer"
        subtitle="480 px right sheet, Esc to close."
        width={480}
        footer={<ActionButton onClick={() => setDrawer(false)}>Done</ActionButton>}
      >
        <p className="text-[13px] leading-5 text-ink">
          Long forms and detail views live in a drawer or a page, never a modal. The drawer keeps the
          list behind it and the hostel chip still visible.
        </p>
      </Drawer>

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => setConfirm(false)}
        title="Cancel this booking?"
        confirmLabel="Cancel booking"
        description="Release the bed for Mei Tanaka. The audit log keeps the record."
      />
    </Card>
  )
}
