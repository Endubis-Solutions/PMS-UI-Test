import { History, Lock } from 'lucide-react'
import { AUDIT } from '../data/ops'
import { useApp } from '../lib/store'
import { navigate } from '../lib/router'
import { ActionButton, Card, PageHeader } from '../components/ui'
import { EmptyState } from '../components/feedback'
import { AuditTable } from './report-sections'

export default function Logs() {
  const { isAdmin, hostel } = useApp()

  if (!isAdmin) {
    return (
      <EmptyState
        icon={Lock}
        title="Admin access required"
        description="The audit log is limited to the owner account. Staff activity is recorded from Finance entry."
        action={<ActionButton onClick={() => navigate('/dashboard')}>Back to dashboard</ActionButton>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={History}
        title="Logs"
        subtitle={`${hostel.short} · append-only record of every change, actor and timestamp.`}
      />
      <Card className="overflow-hidden">
        <AuditTable rows={AUDIT} />
      </Card>
    </div>
  )
}
