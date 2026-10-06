import { cn } from '@/lib/cn'
import { useState, type ReactNode } from 'react'

interface PanelLayoutProps {
  title: string
  panel: ReactNode
  children: ReactNode
}

/** Page content plus a collapsible full-height side panel, flush with the topbar. */
export function PanelLayout({ title, panel, children }: PanelLayoutProps) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <div className="-mt-5 -mr-[34px] -mb-[34px] flex min-h-[calc(100%+54px)]">
      <div className="min-w-0 flex-1 pt-5 pr-8 pb-[34px]">{children}</div>

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
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('size-4 transition-transform', !isOpen && 'rotate-180')}
              >
                <path d="m9.5 6 6 6-6 6" />
              </svg>
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
