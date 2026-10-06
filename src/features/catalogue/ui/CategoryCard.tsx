import type { Category } from '@auto-lincoln/contracts'
import { Link } from '@tanstack/react-router'

export function CategoryCard({ category }: { category: Category }) {
  const { id, title, image } = category

  return (
    <Link
      to="/parts/catalogue/$categoryId"
      params={{ categoryId: id }}
      className="group flex h-[209px] w-[352px] flex-col bg-surface shadow-card-1 outline-none transition-shadow hover:shadow-card-hover focus-visible:ring-2 focus-visible:ring-accent"
    >
      <span className="h-[147px] w-full overflow-hidden">
        <img
          src={image}
          alt=""
          loading="lazy"
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </span>

      <h3 className="flex flex-1 items-center justify-between border-t border-line px-5 font-display text-card-title font-medium text-ink transition-colors group-hover:text-accent">
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
