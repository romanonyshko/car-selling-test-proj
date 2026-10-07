import type { Category } from '@auto-lincoln/contracts'
import { Link } from '@tanstack/react-router'
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
      <span className={cn('aspect-[352/147] overflow-hidden', isList ? 'w-[200px] shrink-0' : 'w-full')}>
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      <h3
        className={cn(
          'flex items-center justify-between border-line px-5 font-display text-card-title font-medium text-ink transition-colors group-hover:text-accent',
          isList ? 'flex-1 border-l' : 'h-[62px] border-t',
        )}
      >
        {title}
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100"
        >
          <path d="m9.5 6 6 6-6 6" />
        </svg>
      </h3>
    </Link>
  )
}
