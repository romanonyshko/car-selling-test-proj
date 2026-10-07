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
    <ul className={cn(view === 'grid' ? 'grid grid-cols-3 gap-x-8 gap-y-[30px]' : 'flex flex-col gap-3')}>
      {categories.map((category) => (
        <li key={category.id}>
          <CategoryCard category={category} view={view} />
        </li>
      ))}
    </ul>
  )
}
