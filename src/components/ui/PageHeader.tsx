import { Link, type LinkProps } from '@tanstack/react-router'
import { Fragment, type ReactNode } from 'react'

export type Crumb = string | { label: string; to: LinkProps['to'] }

interface PageHeaderProps {
  /** Breadcrumb trail: the last item is the current page. */
  crumbs: Crumb[]
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
          const label = typeof crumb === 'string' ? crumb : crumb.label

          return (
            <Fragment key={label}>
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
              {typeof crumb === 'string' ? (
                <span className={isCurrent ? 'text-ink' : 'text-ink-muted'}>{crumb}</span>
              ) : (
                <Link to={crumb.to} className="text-ink-muted hover:text-accent">
                  {crumb.label}
                </Link>
              )}
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
