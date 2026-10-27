import { ALL_CATEGORIES } from '../data/finance'
import { PAYMENT_METHODS } from '../data/core'
import { Card, cx } from '../components/ui'
import { Select } from '../components/form'
import { RANGES } from './ledger-filters'

const control = 'w-[150px]'

export function FinanceFilterBar({ filters, set, accounts, people, rowCount, onClear }) {
  const update = (key) => (event) => set({ ...filters, [key]: event.target.value })
  const active =
    ['type', 'category', 'accountId', 'method', 'recordedBy'].filter((key) => filters[key] !== 'all').length +
    (filters.guest ? 1 : 0) +
    (filters.range !== 'month' ? 1 : 0)
  return (
    <Card className="p-3">
      <div className="flex flex-wrap items-end gap-2">
        <div className="w-[160px]">
          <Select aria-label="Date range" value={filters.range} onChange={update('range')}>
            {RANGES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
          </Select>
        </div>
        <div className="w-[120px]">
          <Select aria-label="Type" value={filters.type} onChange={update('type')}>
            <option value="all">All types</option>
            <option>Income</option>
            <option>Expense</option>
          </Select>
        </div>
        <div className="w-[158px]">
          <Select aria-label="Category" value={filters.category} onChange={update('category')}>
            <option value="all">All categories</option>
            {ALL_CATEGORIES.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <div className={control}>
          <Select aria-label="Account" value={filters.accountId} onChange={update('accountId')}>
            <option value="all">All accounts</option>
            {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
          </Select>
        </div>
        <div className="w-[132px]">
          <Select aria-label="Payment method" value={filters.method} onChange={update('method')}>
            <option value="all">All methods</option>
            {PAYMENT_METHODS.map((item) => <option key={item}>{item}</option>)}
          </Select>
        </div>
        <div className={control}>
          <Select aria-label="Recorded by" value={filters.recordedBy} onChange={update('recordedBy')}>
            <option value="all">Anyone</option>
            {people.map((person) => <option key={person}>{person}</option>)}
          </Select>
        </div>
        <input
          aria-label="Linked guest"
          value={filters.guest}
          onChange={(event) => set({ ...filters, guest: event.target.value })}
          placeholder="Linked guest"
          className="h-9 w-[150px] rounded-control border border-line bg-card px-3 text-[14px] text-ink placeholder:text-muted hover:border-blocked focus:border-primary"
        />
        <button
          type="button"
          onClick={onClear}
          className={cx('ml-auto h-9 px-2 text-[12px] font-medium text-primary hover:text-primary-hover', active === 0 && 'invisible')}
        >
          Clear all
        </button>
        <span className="tnum pb-2 text-[12px] text-muted">{rowCount} rows</span>
      </div>
    </Card>
  )
}
