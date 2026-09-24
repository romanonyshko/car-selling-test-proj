import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { SupportIcon } from '@/components/icons/SupportIcon'
import { cn } from '@/lib/cn'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { navigation } from './navigation'

const itemClass = 'relative flex items-center text-nav transition-colors'

const NARROW_SCREEN = '(width < 805px)'

export function Sidebar() {
  const isNarrow = useMediaQuery(NARROW_SCREEN)
  const [collapsed, setCollapsed] = useState(isNarrow)

  const [wasNarrow, setWasNarrow] = useState(isNarrow)
  if (isNarrow !== wasNarrow) {
    setWasNarrow(isNarrow)
    if (isNarrow) setCollapsed(true)
  }

  const overlay = isNarrow && !collapsed
  const rowWidth = !overlay && 'w-nav-group'
  const closeOverlay = () => {
    if (overlay) setCollapsed(true)
  }

  return (
    <>
      {overlay && <div aria-hidden className="w-sidebar-collapsed shrink-0" />}

      <aside
        className={cn(
          'flex shrink-0 flex-col overflow-hidden border-r border-line bg-surface transition-[width]',
          overlay
            ? 'fixed inset-0 z-50 w-full'
            : collapsed
              ? 'w-sidebar-collapsed'
              : 'w-sidebar',
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
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  title={item.label}
                  onClick={closeOverlay}
                >
                  {({ isActive }) => (
                    <span
                      className={cn(
                        itemClass,
                        !collapsed && rowWidth,
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
                </Link>

                {!collapsed &&
                  item.children?.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      activeOptions={{ exact: child.to === '/' }}
                      onClick={closeOverlay}
                      className={cn(itemClass, rowWidth, 'h-nav-sub rounded-l-[14px] pl-[80px]')}
                      activeProps={{ className: 'font-bold text-ink' }}
                      inactiveProps={{ className: 'font-medium text-ink-muted hover:text-ink' }}
                    >
                      {child.label}
                    </Link>
                  ))}
              </div>
            )
          })}
        </nav>

        <Link
          to="/support"
          title="Support"
          onClick={closeOverlay}
          className={cn(
            itemClass,
            collapsed ? 'pl-[21px]' : 'pl-[28px]',
            !collapsed && rowWidth,
            'mt-auto mb-[30px] ml-[9px] h-nav-item font-bold',
          )}
          activeProps={{ className: 'text-accent' }}
          inactiveProps={{ className: 'text-ink hover:text-accent' }}
        >
          <span className="size-[21px] shrink-0">
            <SupportIcon />
          </span>
          <span className={collapsed ? 'sr-only' : 'ml-[24px] whitespace-nowrap'}>Support</span>
        </Link>
      </aside>
    </>
  )
}
