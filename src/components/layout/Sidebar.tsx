import { CaretDownIcon } from '@/components/icons/CaretDownIcon'
import { ChevronLeftIcon } from '@/components/icons/ChevronLeftIcon'
import { SupportIcon } from '@/components/icons/SupportIcon'
import { cn } from '@/lib/cn'
import { NARROW_SCREEN, PHONE_SCREEN } from '@/lib/mediaQueries'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { Link, useLocation } from '@tanstack/react-router'
import { useState } from 'react'
import logo from '@/assets/logo.png'
import { navigation } from './navigation'

const itemClass = 'relative flex items-center text-nav transition-colors'

interface SidebarProps {
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const isNarrow = useMediaQuery(NARROW_SCREEN)
  const isPhone = useMediaQuery(PHONE_SCREEN)
  const [userCollapsed, setCollapsed] = useState(isNarrow)
  const collapsed = isPhone ? false : userCollapsed

  const [wasNarrow, setWasNarrow] = useState(isNarrow)
  if (isNarrow !== wasNarrow) {
    setWasNarrow(isNarrow)
    if (isNarrow) setCollapsed(true)
  }

  const pathname = useLocation({ select: (location) => location.pathname })
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({})

  const overlay = isPhone || (isNarrow && !collapsed)
  const rowWidth = !overlay && 'w-nav-group'
  const closeOverlay = () => {
    if (isPhone) onMobileClose()
    else if (overlay) setCollapsed(true)
  }

  if (isPhone && !isMobileOpen) return null

  return (
    <>
      {overlay && !isPhone && <div aria-hidden className="w-sidebar-collapsed shrink-0" />}

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
            <img
              src={logo}
              alt="Auto Detail"
              className="absolute top-[26px] left-[38px] h-[48px] w-[98px]"
            />
          )}

          <button
            type="button"
            onClick={() => (isPhone ? onMobileClose() : setCollapsed((c) => !c))}
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

            const isOpen = openGroups[item.label] ?? pathname.startsWith(String(item.to))

            return (
              <div key={item.to}>
                <div className={cn('relative', !collapsed && rowWidth)}>
                  <Link
                    to={item.to}
                    title={item.label}
                    onClick={closeOverlay}
                  >
                    {({ isActive }) => (
                      <span
                        className={cn(
                          itemClass,
                          'h-nav-item pl-[21px] font-bold',
                          isActive
                            ? 'bg-accent-soft text-accent'
                            : 'text-ink-muted hover:bg-accent-soft/40 hover:text-ink',
                        )}
                      >
                        <span className="size-[21px] shrink-0">
                          <Icon />
                        </span>
                        <span className={collapsed ? 'sr-only' : 'ml-[19px] whitespace-nowrap'}>
                          {item.label}
                        </span>
                        {isActive && (
                          <span
                            aria-hidden
                            className="absolute inset-y-0 right-0 w-[5px] rounded-full bg-accent"
                          />
                        )}
                      </span>
                    )}
                  </Link>

                  {item.children && !collapsed && (
                    <button
                      type="button"
                      onClick={() => setOpenGroups((groups) => ({ ...groups, [item.label]: !isOpen }))}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${item.label}`}
                      className="group/caret absolute inset-y-0 right-[16px] grid w-[33px] place-items-center"
                    >
                      <span
                        className={cn(
                          'h-[5px] w-[9px] text-ink opacity-60 transition group-hover/caret:opacity-100',
                          !isOpen && '-rotate-90',
                        )}
                      >
                        <CaretDownIcon />
                      </span>
                    </button>
                  )}
                </div>

                {!collapsed && item.children && (
                  <div
                    className={cn(
                      'grid transition-[grid-template-rows] duration-200',
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                    )}
                  >
                    <div className="overflow-hidden" inert={!isOpen}>
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          activeOptions={{ exact: child.to === item.to }}
                          onClick={closeOverlay}
                          className={cn(itemClass, rowWidth, 'h-nav-sub rounded-l-[14px] pl-[80px] font-bold')}
                          activeProps={{ className: 'text-ink' }}
                          inactiveProps={{ className: 'text-ink-muted hover:text-ink' }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
          inactiveProps={{ className: 'text-ink-muted hover:text-ink' }}
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
