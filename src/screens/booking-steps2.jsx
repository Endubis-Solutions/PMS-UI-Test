import { Minus, Plus } from 'lucide-react'
import { bedLabel, bedRoom } from '../data/core'
import { Card, SectionTitle } from '../components/ui'
import { ActionButton } from '../components/ui'
import { Field, Input, Select } from '../components/form'

export function StepRooming({ rooming, setRooming, selected }) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-6 py-4">
        <SectionTitle hint="One row per guest">Rooming list</SectionTitle>
        <ActionButton
          variant="secondary"
          size="sm"
          icon={Plus}
          onClick={() =>
            setRooming((rows) => [
              ...rows,
              { id: Date.now(), name: '', country: '', bed: selected[0] ?? '' },
            ])
          }
        >
          Add guest
        </ActionButton>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-left">
          <thead>
            <tr className="border-y border-line bg-page">
              {['Guest name', 'Country', 'Bed', ''].map((header) => (
                <th key={header} className="px-4 py-2 text-label uppercase tracking-[0.08em] text-muted">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooming.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                <td className="px-4 py-2">
                  <Input
                    aria-label="Guest name"
                    value={row.name}
                    placeholder="Full name"
                    onChange={(event) =>
                      setRooming((rows) => rows.map((item) => (item.id === row.id ? { ...item, name: event.target.value } : item)))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <Input
                    aria-label="Country"
                    value={row.country}
                    placeholder="Country"
                    onChange={(event) =>
                      setRooming((rows) => rows.map((item) => (item.id === row.id ? { ...item, country: event.target.value } : item)))
                    }
                  />
                </td>
                <td className="px-4 py-2">
                  <Select
                    aria-label="Bed"
                    value={row.bed}
                    onChange={(event) =>
                      setRooming((rows) => rows.map((item) => (item.id === row.id ? { ...item, bed: event.target.value } : item)))
                    }
                  >
                    {selected.map((bed) => (
                      <option key={bed} value={bed}>{bedRoom(bed).name} · {bedLabel(bed)}</option>
                    ))}
                  </Select>
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    type="button"
                    aria-label="Remove guest"
                    disabled={rooming.length === 1}
                    onClick={() => setRooming((rows) => rows.filter((item) => item.id !== row.id))}
                    className="flex h-8 w-8 items-center justify-center rounded-control text-muted hover:bg-page hover:text-danger disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

export function StepDeposit({ deposit, setDeposit, paidNow, setPaidNow, hostel, hostelAccounts }) {
  return (
    <Card className="p-6">
      <SectionTitle hint="Account limited to this property">Deposit</SectionTitle>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Deposit (USD)" htmlFor="nb-deposit">
          <Input
            id="nb-deposit"
            type="number"
            min="0"
            value={deposit}
            onChange={(event) => setDeposit(Number(event.target.value))}
          />
        </Field>
        <Field label="Deposit account" htmlFor="nb-account">
          <Select id="nb-account" defaultValue={hostelAccounts[0]?.id}>
            {hostelAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name} · {account.currency}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2 text-[13px] text-ink">
        <input
          type="checkbox"
          className="h-4 w-4 accent-primary"
          checked={paidNow}
          onChange={(event) => setPaidNow(event.target.checked)}
        />
        Take the deposit now at the desk
      </label>
      <p className="mt-2 text-[11px] text-muted">
        {paidNow ? 'Payment is recorded before the booking is created.' : 'The balance stays open on the folio.'}
      </p>
    </Card>
  )
}
