import { PageHeader } from '@/components/ui/PageHeader'
import { SupportChat } from '@/features/support/ui/SupportChat'

export function SupportPage() {
  return (
    <div>
      <PageHeader crumbs={['Support']} title="Support" />
      <SupportChat />
    </div>
  )
}
