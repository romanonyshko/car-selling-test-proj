import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { cn } from '@/lib/cn'
import { COMPACT_SCREEN } from '@/lib/mediaQueries'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { useState, type ReactNode } from 'react'

interface PanelLayoutProps {
  title: string
  panel: ReactNode
  /** Stays in place while the content below it scrolls. */
  header?: ReactNode
  children: ReactNode
}

/** Page content plus a collapsible full-height side panel, flush with the topbar. */
export function PanelLayout({ title, panel, header, children }: PanelLayoutProps) {
  const isCompact = useMediaQuery(COMPACT_SCREEN)
  const [isOpen, setIsOpen] = useState(true)
  const [isCompactOpen, setIsCompactOpen] = useState(false)

  if (isCompact) {
    return (
      <div>
        {header}

        <section className="mb-6 bg-surface shadow-card-1">
          <button
            type="button"
            aria-expanded={isCompactOpen}
            onClick={() => setIsCompactOpen((open) => !open)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
          >
            <h2 className="font-display text-section font-medium text-ink">{title}</h2>
            <span className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-muted">
              <span className={cn('size-4 transition-transform', isCompactOpen ? '-rotate-90' : 'rotate-90')}>
                <ChevronRightIcon />
              </span>
            </span>
          </button>

          {isCompactOpen && <div className="border-t border-line px-5 py-6">{panel}</div>}
        </section>

        {children}
      </div>
    )
  }

  return (
    <div className="-mt-5 -mr-[34px] -mb-[34px] flex h-[calc(100%+54px)]">
      <div className="flex min-w-0 flex-1 flex-col pt-5 pr-[27px]">
        {header}
        <div className="relative -ml-5 min-h-0 flex-1 overflow-y-auto pr-6 pb-[34px] pl-5">{children}</div>
      </div>

      <aside
        className={cn(
          'shrink-0 overflow-hidden border-l border-line bg-surface transition-[width] duration-300',
          isOpen ? 'w-panel' : 'w-[76px]',
        )}
      >
        <div className="sticky top-0 px-6 py-8">
          <header className="flex items-center gap-4">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-label={isOpen ? `Collapse ${title}` : `Expand ${title}`}
              onClick={() => setIsOpen((open) => !open)}
              className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-ink-muted transition-colors hover:border-accent hover:text-accent"
            >
              <span className={cn('size-4 transition-transform', !isOpen && 'rotate-180')}>
                <ChevronRightIcon />
              </span>
            </button>

            {isOpen && (
              <h2 className="font-display text-panel-title font-medium whitespace-nowrap text-ink">
                {title}
              </h2>
            )}
          </header>

          {isOpen && <div className="mt-[46px] w-[343px]">{panel}</div>}
        </div>
      </aside>
    </div>
  )
}
