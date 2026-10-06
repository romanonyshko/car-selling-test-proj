import { ErrorState } from '@/components/ui/ErrorState'
import { PageHeader } from '@/components/ui/PageHeader'
import { Spinner } from '@/components/ui/Spinner'
import { useCategories } from '@/features/catalogue/hooks/useCategories'
import { useParts } from '@/features/catalogue/hooks/useParts'
import { PartRow } from '@/features/catalogue/ui/PartRow'
import { cn } from '@/lib/cn'
import { Link, useParams } from '@tanstack/react-router'

const catalogueCrumb = { label: 'Catalogue', to: '/parts/catalogue' } as const

export function CategoryPartsPage() {
  const { categoryId } = useParams({ from: '/protected/layout/parts/catalogue/$categoryId' })
  const categories = useCategories()
  const category = categories.data?.find((c) => c.id === categoryId)
  const parts = useParts({ category: category?.id, limit: 20 })

  if (categories.isPending) return <Spinner />
  if (categories.isError) return <ErrorState onRetry={() => categories.refetch()} />

  if (!category) {
    return (
      <div>
        <PageHeader crumbs={['Parts online', catalogueCrumb, 'Not found']} title="Category not found" />
        <Link to="/parts/catalogue" className="text-section font-medium text-accent hover:underline">
          Back to the catalogue
        </Link>
      </div>
    )
  }

  const items = parts.data?.items

  return (
    <div>
      <PageHeader
        crumbs={['Parts online', catalogueCrumb, category.title]}
        title={category.title}
        actions={
          items && (
            <span className="text-crumb text-ink-muted">
              {items.length} {items.length === 1 ? 'part' : 'parts'}
            </span>
          )
        }
      />

      {parts.isPending && <Spinner />}

      {parts.isError && <ErrorState onRetry={() => parts.refetch()} />}

      {items && items.length === 0 && (
        <p className="bg-surface px-5 py-[21px] text-crumb text-ink-muted shadow-card-1">
          No parts in this category yet
        </p>
      )}

      {items && items.length > 0 && (
        <ul
          aria-busy={parts.isFetching}
          className={cn('flex flex-col gap-3 transition-opacity', parts.isPlaceholderData && 'opacity-60')}
        >
          {items.map((part) => (
            <li key={part.id} className="bg-surface shadow-card-1">
              <PartRow part={part} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
