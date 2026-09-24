import { PageHeader } from '@/components/ui/PageHeader'

export function CataloguePage() {
  return (
    <div>
      <PageHeader crumbs={['Parts online', 'Catalogue']} title="Auto parts catalogue" />

      <div className="bg-surface px-5 py-[21px] text-crumb text-ink-muted shadow-card-1">
        Тут буде сітка категорій і панель фільтрів Carmaker / Model / Engine.
      </div>
    </div>
  )
}
