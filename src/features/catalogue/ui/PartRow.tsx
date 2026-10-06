import type { Part } from '@auto-lincoln/contracts'
import { cn } from '@/lib/cn'

const formatPrice = (price: number, currency: Part['currency']) =>
  new Intl.NumberFormat('en', { style: 'currency', currency }).format(price)

export function PartRow({ part }: { part: Part }) {
  const { title, brand, articleNumber, price, currency, inStock, image } = part
  const available = inStock > 0

  return (
    <article className="flex items-center gap-5 px-5 py-4">
      <span className="grid size-16 shrink-0 place-items-center overflow-hidden bg-field text-ink-subtle">
        {image ? (
          <img src={image} alt="" loading="lazy" className="size-full object-cover" />
        ) : (
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
            className="size-7"
          >
            <path d="M12 3 4 7.5v9L12 21l8-4.5v-9L12 3Z M4 7.5l8 4.5 8-4.5 M12 12v9" />
          </svg>
        )}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-card-title font-medium text-ink">{title}</h3>
        <p className="mt-1 text-crumb text-ink-muted">
          {brand} · <span className="font-mono">{articleNumber}</span>
        </p>
      </div>

      <span
        className={cn(
          'shrink-0 px-3 py-1 text-crumb',
          available ? 'bg-positive/10 text-positive' : 'bg-field text-ink-muted',
        )}
      >
        {available ? `${inStock} in stock` : 'Out of stock'}
      </span>

      <span className="w-28 shrink-0 text-right font-display text-section font-medium text-ink">
        {formatPrice(price, currency)}
      </span>
    </article>
  )
}
