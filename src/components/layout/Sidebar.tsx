import { cn } from '@/lib/cn'
import { useState, type ComponentType } from 'react'
import { NavLink } from 'react-router-dom'

/* Icons are drawn to the mockup's 21px nav slot (material-symbols style). */

function DashboardIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M3 3h8v8H3V3Zm2 2v4h4V5H5Zm8-2h8v5h-8V3Zm2 2v1h4V5h-4ZM3 13h8v8H3v-8Zm2 2v4h4v-4H5Zm8-5h8v11h-8V10Zm2 2v7h4v-7h-4Z" />
    </svg>
  )
}

function PartsIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M9.5 2a4.5 4.5 0 0 1 4.39 5.5l7.11 7.11-2.39 2.39-7.11-7.11A4.5 4.5 0 1 1 6.7 3.3l2.4 2.4-1.4 1.4-2.4-2.4A4.5 4.5 0 0 1 9.5 2Zm-4 15a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm0 1.8a.7.7 0 1 0 0 1.4.7.7 0 0 0 0-1.4Z" />
    </svg>
  )
}

function DocumentsIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M6 2h8l4 4v16H6V2Zm2 2v16h8V8h-4V4H8Zm2 8h6v2h-6v-2Zm0 4h6v2h-6v-2Z" />
    </svg>
  )
}

function WarrantyIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20Zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
    </svg>
  )
}

function SupportIcon() {
  return (
    <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-full">
      <path d="M4 3h16v18H4V3Zm2 2v14h12V5H6Zm2.6 2h6.8l-2.6 4.4V16h-1.6v-4.6L8.6 7Z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  )
}

function ChevronLeftIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-full"
    >
      <path d="m14 6-6 6 6 6" />
    </svg>
  )
}

interface NavItem {
  to: string
  label: string
  icon: ComponentType
  children?: { to: string; label: string }[]
}

const navigation: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
    icon: DashboardIcon,
    //need check this 
    children: [
      { to: '/', label: 'Home' },
      { to: '/dashboard/updates', label: 'Updates' },
      { to: '/dashboard/posts', label: 'Posts' },
      { to: '/dashboard/media', label: 'Media' },
    ],
  },
  {
    to: '/parts',
    label: 'Parts online',
    icon: PartsIcon,
    children: [
      { to: '/parts/catalogue', label: 'Catalogue' },
      { to: '/parts/in-stock', label: 'In stock' },
      { to: '/parts/orders', label: 'Orders' },
      { to: '/parts/price-list', label: 'Price list' },
    ],
  },
  { to: '/documents', label: 'Documents', icon: DocumentsIcon },
  { to: '/warranty-claims', label: 'Warranty claims', icon: WarrantyIcon },
]

const itemClass = 'relative flex items-center text-nav transition-colors'

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={cn(
        'flex shrink-0 flex-col overflow-hidden border-r border-line bg-surface transition-[width]',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
      )}
    >
      <div className="relative h-[118px] shrink-0">
        {!collapsed && (
          <span className="absolute top-[26px] left-[38px] flex h-[48px] w-[98px] flex-col justify-center">
            <span className="font-display text-[19px] leading-none font-medium text-accent">
              Auto
            </span>
            <span className="font-display text-[14px] leading-tight tracking-[0.18em] text-ink-muted">
              LINCOLN
            </span>
          </span>
        )}

        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
          aria-expanded={!collapsed}
          className={cn(
            'absolute top-[36px] grid size-[28px] place-items-center rounded-full border border-line text-ink-muted transition-colors hover:text-ink',
            collapsed ? 'left-1/2 -translate-x-1/2' : 'right-[19px]',
          )}
        >
          <span className={cn('size-[12px] transition-transform', collapsed && 'rotate-180')}>
            <ChevronLeftIcon />
          </span>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pl-[9px]">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <div key={item.to}>
              <NavLink to={item.to} end={item.to === '/'} title={item.label}>
                {({ isActive }) => (
                  <span
                    className={cn(
                      itemClass,
                      !collapsed && 'w-nav-group',
                      'h-nav-item pl-[21px] font-bold',
                      isActive
                        ? 'bg-accent-soft text-accent'
                        : 'text-ink hover:bg-accent-soft/40',
                    )}
                  >
                    <span className="size-[21px] shrink-0">
                      <Icon />
                    </span>
                    <span className={collapsed ? 'sr-only' : 'ml-[19px] whitespace-nowrap'}>
                      {item.label}
                    </span>
                    {item.children && !collapsed && (
                      <span className="mr-[19px] ml-auto size-[24px] opacity-60">
                        <ChevronDownIcon />
                      </span>
                    )}
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute inset-y-0 right-0 w-[5px] rounded-full bg-accent"
                      />
                    )}
                  </span>
                )}
              </NavLink>

              {!collapsed &&
                item.children?.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        itemClass,
                        'h-nav-sub w-nav-group rounded-l-[14px] pl-[80px]',
                        isActive
                          ? 'font-bold text-ink'
                          : 'font-medium text-ink-muted hover:text-ink',
                      )
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
            </div>
          )
        })}
      </nav>

      <NavLink
        to="/support"
        title="Support"
        className={({ isActive }) =>
          cn(
            itemClass,
            // Collapsed: same 21px inset as the nav items, so all icons share one axis.
            collapsed ? 'pl-[21px]' : 'w-nav-group pl-[28px]',
            'mt-auto mb-[30px] ml-[9px] h-nav-item font-bold',
            isActive ? 'text-accent' : 'text-ink hover:text-accent',
          )
        }
      >
        <span className="size-[21px] shrink-0">
          <SupportIcon />
        </span>
        <span className={collapsed ? 'sr-only' : 'ml-[24px] whitespace-nowrap'}>Support</span>
      </NavLink>
    </aside>
  )
}
