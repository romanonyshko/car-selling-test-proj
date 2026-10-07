import type { Category } from '@auto-lincoln/contracts'
import { cn } from '@/lib/cn'
import type { CatalogueView } from '../model/catalogueView'
import { CategoryCard } from './CategoryCard'

interface CategoryGridProps {
  categories: Category[]
  view?: CatalogueView
}

export function CategoryGrid({ categories, view = 'grid' }: CategoryGridProps) {
  return (
    <div className="@container">
      <ul
        className={cn(
          view === 'grid'
            ? 'grid grid-cols-1 gap-4 @md:grid-cols-2 @md:gap-6 @xl:grid-cols-3 @xl:gap-x-8 @xl:gap-y-[30px]'
            : 'flex flex-col gap-3',
        )}
      >
        {categories.map((category) => (
          <li key={category.id}>
            <CategoryCard category={category} view={view} />
          </li>
        ))}
      </ul>
    </div>
  )
}
