import { BreadcrumbChevronIcon } from '@/components/icons/BreadcrumbChevronIcon'
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
      <p className="flex flex-wrap items-center gap-x-2 text-crumb">
        {crumbs.map((crumb, index) => {
          const isCurrent = index === crumbs.length - 1
          const label = typeof crumb === 'string' ? crumb : crumb.label

          return (
            <Fragment key={label}>
              {index > 0 && (
                <span className="size-2 text-ink-muted">
                  <BreadcrumbChevronIcon />
                </span>
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

      <div className="mt-4 mb-6 flex items-center justify-between gap-4 sm:mt-6 sm:mb-[37px]">
        <h1 className="min-w-0 text-[26px]/8 font-medium break-words text-ink sm:text-title">{title}</h1>
        {actions}
      </div>
    </header>
  )
}
