import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { ActionButton, Card, SectionTitle } from '../components/ui'
import { Input } from '../components/form'

export function SplitCard({ booking, balance, onSave }) {
  const half = Math.round(balance / 2)
  const [payers, setPayers] = useState([
    { id: 1, name: booking.guestName, amount: half },
    { id: 2, name: '', amount: balance - half },
  ])
  const total = payers.reduce((sum, payer) => sum + Number(payer.amount || 0), 0)
  const remaining = balance - total

  return (
    <Card className="p-6">
      <SectionTitle hint={`${booking.currency} only`}>Split between guests</SectionTitle>
      <div className="mt-3 flex flex-col gap-2">
        {payers.map((payer) => (
          <div key={payer.id} className="flex items-center gap-2">
            <Input
              aria-label="Guest name"
              value={payer.name}
              placeholder="Guest name"
              onChange={(event) =>
                setPayers((rows) => rows.map((row) => (row.id === payer.id ? { ...row, name: event.target.value } : row)))
              }
            />
            <Input
              aria-label="Amount"
              type="number"
              className="w-[130px]"
              value={payer.amount}
              onChange={(event) =>
                setPayers((rows) => rows.map((row) => (row.id === payer.id ? { ...row, amount: Number(event.target.value) } : row)))
              }
            />
            <button
              type="button"
              aria-label="Remove payer"
              disabled={payers.length === 1}
              onClick={() => setPayers((rows) => rows.filter((row) => row.id !== payer.id))}
              className="flex h-9 w-9 items-center justify-center rounded-control text-muted hover:bg-page hover:text-danger disabled:opacity-40"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px]">
        <button
          type="button"
          onClick={() => setPayers((rows) => [...rows, { id: Date.now(), name: '', amount: 0 }])}
          className="font-medium text-primary hover:text-primary-hover"
        >
          Add another guest
        </button>
        <span className={remaining === 0 ? 'text-muted' : 'text-danger'}>
          {remaining === 0
            ? 'Split matches the balance'
            : `${booking.currency} ${remaining.toLocaleString('en-US')} unassigned`}
        </span>
      </div>

      <div className="mt-3 flex justify-end border-t border-line pt-3">
        <ActionButton
          size="sm"
          disabled={remaining !== 0 || payers.some((payer) => !payer.name.trim())}
          onClick={() => onSave(payers)}
        >
          Save split
        </ActionButton>
      </div>
    </Card>
  )
}
