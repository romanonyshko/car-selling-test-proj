import type { Category } from '@auto-lincoln/contracts'
import { Link } from '@tanstack/react-router'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { cn } from '@/lib/cn'
import type { CatalogueView } from '../model/catalogueView'

interface CategoryCardProps {
  category: Category
  view?: CatalogueView
}

export function CategoryCard({ category, view = 'grid' }: CategoryCardProps) {
  const { id, title, image } = category
  const isList = view === 'list'

  return (
    <Link
      to="/parts/catalogue/$categoryId"
      params={{ categoryId: id }}
      search={true}
      className={cn(
        'group flex w-full bg-surface shadow-card-1 outline-none transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accent',
        isList ? 'flex-row' : 'flex-col',
      )}
    >
      <span className={cn('aspect-[352/147] overflow-hidden', isList ? 'w-28 shrink-0 @md:w-[200px]' : 'w-full')}>
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      <h3
        className={cn(
          'flex min-w-0 items-center justify-between gap-2 border-line px-4 font-display text-card-title font-medium text-ink transition-colors group-hover:text-accent',
          isList ? 'flex-1 border-l @md:px-5' : 'h-[62px] border-t @md:px-5',
        )}
      >
        {title}
        <span className="size-5 shrink-0 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100">
          <ChevronRightIcon />
        </span>
      </h3>
    </Link>
  )
}
