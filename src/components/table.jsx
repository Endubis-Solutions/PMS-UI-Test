import { Inbox, Search } from 'lucide-react'
import { Card, cx } from './ui'
import { EmptyState, SkeletonRows } from './feedback'

export function DataTable({
  columns,
  rows,
  rowKey = 'id',
  onRowClick,
  empty,
  loading = false,
  loadingRows = 5,
  className,
  minWidth = 760,
  footer,
}) {
  return (
    <div className={cx('w-full', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left" style={{ minWidth }}>
          <thead>
            <tr className="border-b border-line">
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className={cx(
                    'whitespace-nowrap px-3 py-2.5 text-label uppercase tracking-[0.08em] text-muted first:pl-6 last:pr-6',
                    column.align === 'right' && 'text-right',
                    column.headerClassName,
                  )}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          {!loading ? (
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cx(
                    'border-b border-line transition-colors duration-150 last:border-0',
                    onRowClick && 'cursor-pointer hover:bg-page',
                  )}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={cx(
                        'px-3 py-3 align-middle text-[14px] text-ink first:pl-6 last:pr-6',
                        column.align === 'right' && 'text-right',
                        column.cellClassName,
                      )}
                    >
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>
      </div>
      {loading ? <SkeletonRows rows={loadingRows} columns={Math.min(columns.length, 6)} /> : null}
      {!loading && rows.length === 0
        ? empty ?? (
            <EmptyState
              icon={Inbox}
              title="Nothing to show"
              description="No records match this view yet."
              compact
            />
          )
        : null}
      {footer ? <div className="border-t border-line">{footer}</div> : null}
    </div>
  )
}

export function FilterBar({ children, onClear, activeCount = 0, resultCount, resultLabel = 'results', className }) {
  return (
    <Card className={cx('flex flex-wrap items-end gap-2 p-3', className)}>
      {children}
      <div className="ml-auto flex items-center gap-3 pl-2">
        {activeCount > 0 && onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="text-[12px] font-medium text-primary hover:text-primary-hover"
          >
            Clear all ({activeCount})
          </button>
        ) : null}
        {resultCount != null ? (
          <span className="tnum whitespace-nowrap text-[12px] text-muted">
            {resultCount} {resultLabel}
          </span>
        ) : null}
      </div>
    </Card>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search guests', className, ...props }) {
  return (
    <div className={cx('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="h-9 w-full rounded-control border border-line bg-card pl-9 pr-3 text-[14px] text-ink outline-none transition-colors placeholder:text-muted hover:border-blocked focus:border-primary"
        {...props}
      />
    </div>
  )
}
