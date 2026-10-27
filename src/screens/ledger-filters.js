export const RANGES = [
  { id: 'month', label: 'September 2026', from: '2026-09-01', to: '2026-09-30' },
  { id: 'last-month', label: 'August 2026', from: '2026-08-01', to: '2026-08-31' },
  { id: 'last-30', label: 'Last 30 days', from: '2026-08-19', to: '2026-09-17' },
  { id: 'all', label: 'All dates', from: '2000-01-01', to: '2099-12-31' },
]

export const DEFAULT_FILTERS = {
  range: 'month',
  type: 'all',
  category: 'all',
  accountId: 'all',
  method: 'all',
  recordedBy: 'all',
  guest: '',
}

export function filterLedger(ledger, filters, { empty = false, preset } = {}) {
  if (empty || preset === 'empty') return []
  const range = RANGES.find((item) => item.id === filters.range) ?? RANGES[0]
  return ledger.filter((entry) => {
    if (entry.date < range.from || entry.date > range.to) return false
    if (filters.type !== 'all' && entry.type !== filters.type) return false
    if (filters.category !== 'all' && entry.category !== filters.category) return false
    if (filters.accountId !== 'all' && entry.accountId !== filters.accountId) return false
    if (filters.method !== 'all' && entry.method !== filters.method) return false
    if (filters.recordedBy !== 'all' && entry.recordedBy !== filters.recordedBy) return false
    if (filters.guest && !entry.guest.toLowerCase().includes(filters.guest.toLowerCase())) return false
    return true
  })
}

export function activeFilterCount(filters) {
  return ['type', 'category', 'accountId', 'method', 'recordedBy'].filter((key) => filters[key] !== 'all').length +
    (filters.guest ? 1 : 0)
}

export function toCsv(rows, accounts) {
  const header = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Currency', 'Account', 'Method', 'Recorded by', 'Guest']
  const body = rows.map((entry) => [
    entry.date,
    entry.type,
    entry.category,
    `"${entry.description.replace(/"/g, '""')}"`,
    entry.amount,
    entry.currency,
    accounts.find((account) => account.id === entry.accountId)?.name ?? '',
    entry.method,
    entry.recordedBy,
    entry.guest,
  ])
  return [header, ...body].map((row) => row.join(',')).join('\n')
}
