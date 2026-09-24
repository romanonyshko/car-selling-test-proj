import { PageHeader } from '@/components/ui/PageHeader'

interface PlaceholderPageProps {
  crumbs: string[]
  title: string
}

export function PlaceholderPage({ crumbs, title }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader crumbs={crumbs} title={title} />

      <div className="bg-surface px-5 py-[21px] text-crumb text-ink-muted shadow-card-1">
        Сторінка в розробці.
      </div>
    </div>
  )
}
