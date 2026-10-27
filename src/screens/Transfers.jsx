import { ArrowLeft, ArrowLeftRight, Lock } from 'lucide-react'
import { useApp } from '../lib/store'
import { navigate } from '../lib/router'
import { ActionButton, Card, PageHeader, SectionTitle } from '../components/ui'
import { EmptyState } from '../components/feedback'
import { TransferRow } from '../components/account-strip'
import { TransferForm } from './transfer-form'

export default function Transfers() {
  const { isAdmin, hostel, hostelAccounts, hostelTransfers } = useApp()

  if (!isAdmin) {
    return (
      <EmptyState
        icon={Lock}
        title="Admin access required"
        description="Transfers move money between this property’s accounts. Only the owner can do that."
        action={<ActionButton onClick={() => navigate('/finance')}>Back to finance</ActionButton>}
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        icon={ArrowLeftRight}
        title="Transfers"
        subtitle={`Move balances between ${hostel.short} accounts. Another property’s accounts are never listed.`}
        actions={
          <ActionButton variant="secondary" icon={ArrowLeft} onClick={() => navigate('/finance')}>
            Finance log
          </ActionButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <TransferForm />

        <Card className="overflow-hidden">
          <div className="px-6 py-4">
            <SectionTitle hint={`${hostelTransfers.length} this period`}>Transfer history</SectionTitle>
          </div>
          {hostelTransfers.length ? (
            <div className="flex flex-col gap-2 px-4 pb-4">
              {hostelTransfers.map((transfer) => (
                <TransferRow key={transfer.id} transfer={transfer} accounts={hostelAccounts} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={ArrowLeftRight}
              title="No transfers yet"
              description="Moves between cash and bank accounts will appear here."
              compact
            />
          )}
          <div className="border-t border-line px-6 py-2.5 text-[11px] text-muted">
            Every transfer is written to the audit log with actor and timestamp.
          </div>
        </Card>
      </div>
    </div>
  )
}
