import type { Part } from '@auto-lincoln/contracts'
import { BoxIcon } from '@/components/icons/BoxIcon'
import { cn } from '@/lib/cn'

const formatPrice = (price: number, currency: Part['currency']) =>
  new Intl.NumberFormat('en', { style: 'currency', currency }).format(price)

export function PartRow({ part }: { part: Part }) {
  const { title, brand, articleNumber, price, currency, inStock, image } = part
  const available = inStock > 0

  return (
    <article className="@container">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-4 @lg:flex-nowrap @lg:gap-x-5 @lg:px-5">
        <span className="grid size-14 shrink-0 place-items-center overflow-hidden bg-field text-ink-subtle @lg:size-16">
          {image ? (
            <img src={image} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <span className="size-7">
              <BoxIcon />
            </span>
          )}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-display text-card-title font-medium text-ink @lg:line-clamp-1">{title}</h3>
          <p className="mt-1 text-crumb text-ink-muted">
            {brand} · <span className="font-mono">{articleNumber}</span>
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-3 @lg:contents">
          <span
            className={cn(
              'shrink-0 px-3 py-1 text-crumb',
              available ? 'bg-positive/10 text-positive' : 'bg-field text-ink-muted',
            )}
          >
            {available ? `${inStock} in stock` : 'Out of stock'}
          </span>

          <span className="shrink-0 text-right font-display text-section font-medium text-ink @lg:w-28">
            {formatPrice(price, currency)}
          </span>
        </div>
      </div>
    </article>
  )
}
