import { Fragment, type ReactNode } from 'react'

interface PageHeaderProps {
  /** Breadcrumb trail: the last item is the current page. */
  crumbs: string[]
  title: string
  /** Controls aligned with the title on the right (grid / list toggle, …). */
  actions?: ReactNode
}

export function PageHeader({ crumbs, title, actions }: PageHeaderProps) {
  return (
    <header>
      <p className="flex items-center gap-2 text-crumb">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1

          return (
            <Fragment key={crumb}>
              {index > 0 && (
                <svg
                  aria-hidden
                  viewBox="0 0 8 8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-2 text-ink-muted"
                >
                  <path d="m2.5 1 3 3-3 3" />
                </svg>
              )}
              <span className={isCurrent ? 'text-ink' : 'text-ink-muted'}>
                {crumb}
              </span>
            </Fragment>
          )
        })}
      </p>

      <div className="mt-6 mb-[37px] flex items-center justify-between gap-4">
        <h1 className="text-title font-medium text-ink">{title}</h1>
        {actions}
      </div>
    </header>
  )
}
