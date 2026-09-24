import { PageHeader } from '@/components/ui/PageHeader'

export function SupportPage() {
  return (
    <div>
      <PageHeader crumbs={['Support']} title="Support" />

      <div className="bg-surface px-5 py-[21px] text-crumb text-ink-muted shadow-card-1">
        Розділ у розробці.
      </div>
    </div>
  )
}
