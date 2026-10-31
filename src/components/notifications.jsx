import { useRef, useState } from 'react'
import { Bell, CheckCheck, X } from 'lucide-react'
import { useApp } from '../lib/store'
import { useClickOutside } from '../lib/hooks'
import { cx } from './ui'

const TONE_DOT = {
  info: 'bg-primary',
  warning: 'bg-warning',
  danger: 'bg-danger',
  success: 'bg-success',
}

export function NotificationsMenu() {
  const { notifications, markNotificationRead, markAllNotificationsRead, dismissNotification } = useApp()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useClickOutside(ref, () => setOpen(false))
  const unread = notifications.filter((item) => item.unread).length

  return (
    <div className="relative shrink-0" ref={ref}>
      <button
        type="button"
        aria-label={unread ? `Notifications · ${unread} unread` : 'Notifications'}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={cx(
          'relative flex h-9 w-9 items-center justify-center rounded-control transition-colors duration-150',
          open ? 'bg-page text-ink' : 'text-muted hover:bg-page hover:text-ink',
        )}
      >
        <Bell className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
        {unread > 0 ? (
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            {unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)] animate-fade-in rounded-card border border-line bg-card shadow-raised"
        >
          <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-3">
            <p className="text-[13px] font-semibold text-ink">Notifications</p>
            {unread > 0 ? (
              <button
                type="button"
                onClick={markAllNotificationsRead}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary-hover"
              >
                <CheckCheck className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                Mark all read
              </button>
            ) : null}
          </div>

          {notifications.length ? (
            <ul className="max-h-[400px] overflow-y-auto p-1.5">
              {notifications.map((item) => (
                <li
                  key={item.id}
                  className="group flex items-start gap-2.5 rounded-control px-3 py-2.5 transition-colors hover:bg-page"
                >
                  <span
                    className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', item.unread ? TONE_DOT[item.tone] ?? 'bg-primary' : 'bg-line')}
                    aria-hidden="true"
                  />
                  <div
                    className="min-w-0 flex-1 cursor-pointer"
                    onClick={() => item.unread && markNotificationRead(item.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className={cx('text-[13px] leading-5 text-ink', item.unread && 'font-semibold')}>{item.title}</p>
                      <button
                        type="button"
                        aria-label="Dismiss notification"
                        onClick={(event) => {
                          event.stopPropagation()
                          dismissNotification(item.id)
                        }}
                        className="shrink-0 rounded-[6px] p-1 text-muted opacity-0 transition-opacity hover:bg-page hover:text-danger group-hover:opacity-100"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[12px] leading-4 text-muted">{item.description}</p>
                    <p className="mt-1 text-[11px] text-muted">{item.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-[12px] text-muted">You’re all caught up.</p>
          )}
        </div>
      ) : null}
    </div>
  )
}