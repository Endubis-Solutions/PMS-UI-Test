import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cx } from './ui'

export const CONTROL =
  'h-9 w-full rounded-control border border-line bg-card px-3 text-[14px] text-ink outline-none transition-colors duration-150 placeholder:text-muted hover:border-blocked focus:border-primary disabled:cursor-not-allowed disabled:bg-page disabled:text-muted'

export function Label({ htmlFor, children, required, className }) {
  return (
    <label htmlFor={htmlFor} className={cx('text-label uppercase tracking-[0.08em] text-muted', className)}>
      {children}
      {required ? <span className="ml-0.5 text-danger">*</span> : null}
    </label>
  )
}

export function Field({ label, htmlFor, hint, error, required, children, className }) {
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      {label ? (
        <Label htmlFor={htmlFor} required={required}>
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="text-[11px] leading-4 text-danger">{error}</p>
      ) : hint ? (
        <p className="text-[11px] leading-4 text-muted">{hint}</p>
      ) : null}
    </div>
  )
}

export const Input = forwardRef(function Input({ className, invalid, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cx(CONTROL, invalid && 'border-danger hover:border-danger focus:border-danger', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
})

export function Select({ className, children, invalid, ...props }) {
  return (
    <div className="relative">
      <select
        className={cx(
          CONTROL,
          'cursor-pointer appearance-none pr-9',
          invalid && 'border-danger hover:border-danger focus:border-danger',
          className,
        )}
        aria-invalid={invalid || undefined}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  )
}

export function Textarea({ className, invalid, ...props }) {
  return (
    <textarea
      className={cx(CONTROL, 'h-auto min-h-[72px] py-2', invalid && 'border-danger', className)}
      aria-invalid={invalid || undefined}
      {...props}
    />
  )
}

export function Checkbox({ id, label, description, className, ...props }) {
  return (
    <div className={cx('flex items-start gap-2.5', className)}>
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-[4px] border-line accent-primary"
        {...props}
      />
      <div>
        <label htmlFor={id} className="cursor-pointer text-[14px] text-ink">
          {label}
        </label>
        {description ? <p className="text-[11px] leading-4 text-muted">{description}</p> : null}
      </div>
    </div>
  )
}
