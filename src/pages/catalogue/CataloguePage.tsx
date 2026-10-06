import { ErrorState } from '@/components/ui/ErrorState'
import { PanelLayout } from '@/components/layout/PanelLayout'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { useCategories } from '@/features/catalogue/hooks/useCategories'
import { CategoryGrid } from '@/features/catalogue/ui/CategoryGrid'
import { PartsFilterPanel } from '@/features/catalogue/ui/PartsFilterPanel'

export function CataloguePage() {
  const { data, isLoading, isError, refetch } = useCategories()

  return (
    <PanelLayout title="Find your car parts" panel={<PartsFilterPanel />}>
      <PageHeader crumbs={['Parts online', 'Catalogue']} title="Auto parts catalogue" />

      {isLoading && <Spinner />}

      {!isLoading && (isError || !data) && <ErrorState onRetry={() => refetch()} />}

      {data && data.length === 0 && (
        <p className="bg-surface px-5 py-[21px] text-crumb text-ink-muted shadow-card-1">
          No categories yet
        </p>
      )}

      {data && data.length > 0 && <CategoryGrid categories={data} />}
    </PanelLayout>
  )
}
