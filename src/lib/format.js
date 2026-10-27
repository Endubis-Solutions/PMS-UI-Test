const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function parseISO(value) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toISO(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDays(value, count) {
  const date = parseISO(value)
  date.setDate(date.getDate() + count)
  return toISO(date)
}

export function diffDays(from, to) {
  return Math.round((parseISO(to) - parseISO(from)) / 86400000)
}

export function nights(start, end) {
  return Math.max(0, diffDays(start, end))
}

export function datesFrom(start, count) {
  return Array.from({ length: count }, (_, i) => addDays(start, i))
}

export function fmtDay(value) {
  return DAYS[parseISO(value).getDay()]
}

export function fmtDate(value) {
  const date = parseISO(value)
  return `${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export function fmtMonthDay(value) {
  const date = parseISO(value)
  return `${MONTHS[date.getMonth()]} ${date.getDate()}`
}

export function fmtLong(value) {
  const date = parseISO(value)
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS_LONG[date.getMonth()]} ${date.getFullYear()}`
}

export function fmtShortLong(value) {
  const date = parseISO(value)
  return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}`
}

export function fmtNights(count) {
  return `${count} ${count === 1 ? 'night' : 'nights'}`
}

export function money(amount, currency) {
  const sign = amount < 0 ? '\u2212' : ''
  const abs = Math.abs(amount)
  return `${sign}${currency} ${abs.toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function amountOnly(amount) {
  const sign = amount < 0 ? '\u2212' : ''
  return `${sign}${Math.abs(amount).toLocaleString('en-US', { maximumFractionDigits: 0 })}`
}

export function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function statusLabel(status) {
  return {
    reserved: 'Reserved',
    'checked-in': 'Checked in',
    'checked-out': 'Checked out',
    'no-show': 'No show',
    cancelled: 'Cancelled',
  }[status] ?? status
}

export function isBetween(value, start, end) {
  return value >= start && value < end
}

export function overlaps(aStart, aEnd, bStart, bEnd) {
  return aStart < bEnd && bStart < aEnd
}

export function rangeLabel(start, count) {
  const end = addDays(start, count - 1)
  return `${fmtDate(start)} – ${fmtDate(end)} ${parseISO(end).getFullYear()}`
}

export function plural(count, singular, pluralForm) {
  return `${count} ${count === 1 ? singular : pluralForm ?? `${singular}s`}`
}
