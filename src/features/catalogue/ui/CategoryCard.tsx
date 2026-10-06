import type { Category } from '@auto-lincoln/contracts'

export function CategoryCard({ category }: { category: Category }) {
  const { title, image } = category

  return (
    <article className="flex h-[209px] w-[352px] flex-col bg-surface shadow-card-1">
      <img src={image} alt={title} loading="lazy" className="h-[147px] w-full object-cover" />

      <h3 className="flex flex-1 items-center border-t border-line px-5 font-display text-card-title font-medium text-ink">
        {title}
      </h3>
    </article>
  )
}
