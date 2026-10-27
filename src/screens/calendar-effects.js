import { useEffect } from 'react'

// Mounts the demo states that the brief lists as frames (tooltip, drag, toast, group, hold).
export function useCalendarDemoState(state, bookings, controls) {
  const { notify, setDrag, setDropTarget, setHover } = controls

  useEffect(() => {
    if (state !== 'toast') return
    notify({
      title: 'New booking added automatically',
      description: 'WhatsApp enquiry · Bed C · 18–20 Sep. The bed was free, so the stay is already on the grid.',
    })
  }, [state, notify])

  useEffect(() => {
    if (!['tooltip', 'group', 'hold', 'dragging', 'drag-invalid'].includes(state)) return undefined
    const timer = window.setTimeout(() => {
      if (state === 'dragging' || state === 'drag-invalid') {
        const booking = bookings.find((item) => item.id === 'BK-2419')
        if (!booking) return
        setDrag(booking)
        setDropTarget(
          state === 'dragging'
            ? { bed: 'hawassa-B', date: '2026-09-22', valid: true }
            : {
                bed: 'hawassa-H',
                date: '2026-09-20',
                valid: false,
                conflict: { start: '2026-09-15', end: '2026-09-22', hold: false },
              },
        )
        return
      }
      if (state === 'group') return
      const selector = state === 'hold' ? '[data-pill="hold-H-31"]' : '[data-pill="BK-2419"]'
      const element = document.querySelector(selector)
      if (element) {
        setHover({
          kind: state === 'hold' ? 'hold' : 'booking',
          id: state === 'hold' ? 'H-31' : state === 'group' ? 'BK-2432' : 'BK-2419',
          rect: element.getBoundingClientRect(),
        })
      }
    }, 80)
    return () => window.clearTimeout(timer)
  }, [state, bookings, setDrag, setDropTarget, setHover])
}
