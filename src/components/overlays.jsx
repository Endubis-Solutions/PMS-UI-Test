import { useEffect } from 'react'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { ActionButton, IconButton, cx } from './ui'

function useEscape(open, onClose) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
}

function Scrim({ onClose }) {
  return <div className="absolute inset-0 bg-ink/30" onClick={onClose} aria-hidden="true" />
}

export function Drawer({ open, onClose, title, subtitle, header, tabs, children, footer, width = 480 }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50">
      <Scrim onClose={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Details'}
        className="absolute right-0 top-0 flex h-full max-w-full animate-drawer-in flex-col border-l border-line bg-card shadow-drawer"
        style={{ width }}
      >
        <header className="flex items-start justify-between gap-3 border-b border-line px-6 py-4">
          <div className="min-w-0">
            {header ?? (
              <>
                <h2 className="truncate text-[18px] font-semibold leading-6 text-ink">{title}</h2>
                {subtitle ? <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p> : null}
              </>
            )}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2" />
        </header>
        {tabs ? <div className="px-6">{tabs}</div> : null}
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-line bg-card px-6 py-4">{footer}</div> : null}
      </aside>
    </div>
  )
}

export function Modal({ open, onClose, title, subtitle, children, footer, width = 520, label }) {
  useEscape(open, onClose)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <Scrim onClose={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label ?? title}
        className="relative flex max-h-full w-full animate-modal-in flex-col rounded-card border border-line bg-card shadow-raised"
        style={{ maxWidth: width }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 className="text-[18px] font-semibold leading-6 text-ink">{title}</h2>
            {subtitle ? <p className="mt-0.5 text-[13px] text-muted">{subtitle}</p> : null}
          </div>
          <IconButton icon={X} label="Close" onClick={onClose} className="-mr-2" />
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer ? <div className="border-t border-line px-6 py-4">{footer}</div> : null}
      </div>
    </div>
  )
}

const TOAST_ICONS = {
  success: { icon: CheckCircle2, className: 'text-ink' },
  info: { icon: Info, className: 'text-primary' },
  warning: { icon: AlertTriangle, className: 'text-ink' },
  danger: { icon: AlertCircle, className: 'text-danger' },
}

export function Toast({ toast, onClose }) {
  if (!toast) return null
  const config = TOAST_ICONS[toast.tone] ?? TOAST_ICONS.success
  const Icon = config.icon
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[60] w-[380px] max-w-[calc(100vw-3rem)]">
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-auto flex animate-toast-in items-start gap-3 rounded-card border border-line bg-card p-4 shadow-raised"
      >
        <Icon className={cx('mt-0.5 h-[18px] w-[18px] shrink-0', config.className)} strokeWidth={1.75} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-[14px] font-medium text-ink">{toast.title}</p>
          {toast.description ? <p className="mt-0.5 text-[13px] leading-5 text-muted">{toast.description}</p> : null}
          {toast.action ? <div className="mt-2">{toast.action}</div> : null}
        </div>
        <IconButton icon={X} label="Dismiss" onClick={onClose} className="-mr-1 -mt-1 h-7 w-7" />
      </div>
    </div>
  )
}

export function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmLabel = 'Confirm', tone = 'danger', children }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width={440}
      footer={
        <div className="flex items-center justify-end gap-2">
          <ActionButton variant="secondary" onClick={onClose}>
            Keep booking
          </ActionButton>
          <ActionButton variant={tone === 'danger' ? 'dangerSolid' : 'primary'} onClick={onConfirm}>
            {confirmLabel}
          </ActionButton>
        </div>
      }
    >
      <p className="text-[14px] leading-6 text-ink">{description}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </Modal>
  )
}
