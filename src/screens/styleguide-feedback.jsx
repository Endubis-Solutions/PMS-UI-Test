import { AlertCircle, AlertTriangle, CheckCircle2, Info, Inbox, Plus } from 'lucide-react'
import { Card, SectionTitle, ActionButton } from '../components/ui'
import { Callout, EmptyState, Skeleton } from '../components/feedback'

const TOASTS = [
  { title: 'Booking moved', detail: 'Mei Tanaka now occupies Bed B from 22 Sep.', icon: CheckCircle2, tone: 'text-ink' },
  { title: 'New booking added automatically', detail: 'Direct website · Bed C · 18–20 Sep.', icon: Info, tone: 'text-primary' },
  { title: 'Bed on hold', detail: 'bale-A is closed 18–21 Sep for repairs.', icon: AlertTriangle, tone: 'text-ink' },
  { title: 'Payment failed', detail: 'The card was declined. Balance unchanged.', icon: AlertCircle, tone: 'text-danger' },
]

export function FeedbackSheet() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card className="p-6">
        <SectionTitle hint="Problem plus recovery">Callout</SectionTitle>
        <div className="mt-4 flex flex-col gap-2">
          <Callout tone="info" title="Information">Only today’s arrivals are shown.</Callout>
          <Callout tone="success" title="Saved">The split matches the balance.</Callout>
          <Callout tone="warning" title="Needs attention">A bed is on maintenance hold.</Callout>
          <Callout tone="danger" title="Payment not recorded">This account is in FCY.</Callout>
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle hint="Four tones, one line each">Toast</SectionTitle>
        <div className="mt-4 flex flex-col gap-2">
          {TOASTS.map(({ title, detail, icon: Icon, tone }) => (
            <div key={title} className="flex items-start gap-3 rounded-card border border-line bg-card p-3 shadow-raised">
              <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${tone}`} strokeWidth={1.75} aria-hidden="true" />
              <div>
                <p className="text-[13px] font-medium text-ink">{title}</p>
                <p className="text-[12px] text-muted">{detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle>EmptyState</SectionTitle>
        <div className="mt-2">
          <EmptyState
            icon={Inbox}
            title="No arrivals today"
            description="Nothing is due to check in. Walk-ins can be booked from the calendar."
            action={<ActionButton icon={Plus} size="sm">Create a walk-in</ActionButton>}
            compact
          />
        </div>
      </Card>

      <Card className="p-6">
        <SectionTitle hint="Shaped like the content">Skeleton</SectionTitle>
        <div className="mt-4 flex flex-col gap-3">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-10 w-full" />
          <div className="flex items-center gap-3">
            <Skeleton variant="circle" className="h-9 w-9" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <p className="text-[11px] text-muted">Static blocks, no shimmer: loading never animates longer than 200 ms.</p>
        </div>
      </Card>
    </div>
  )
}
