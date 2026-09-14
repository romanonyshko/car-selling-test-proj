import { cn } from '@/lib/cn'
import { NavLink } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  children?: NavItem[]
}

const navigation: NavItem[] = [
  {
    to: '/',
    label: 'Dashboard',
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
    children: [
      { to: '/parts/catalogue', label: 'Catalogue' },
      { to: '/parts/in-stock', label: 'In stock' },
      { to: '/parts/orders', label: 'Orders' },
      { to: '/parts/price-list', label: 'Price list' },
    ],
  },
  { to: '/documents', label: 'Documents' },
  { to: '/warranty-claims', label: 'Warranty claims' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block rounded-lg px-3 py-2 text-sm transition-colors',
    isActive
      ? 'bg-brand-50 font-medium text-brand-600'
      : 'text-slate-600 hover:bg-slate-50',
  )

export function Sidebar() {
  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-line bg-white">
      <div className="flex h-16 items-center gap-2 border-b border-line px-5">
        <span className="grid size-8 place-items-center rounded-md bg-brand-500 text-sm font-bold text-white">
          A
        </span>
        <span className="text-sm font-semibold text-slate-800">Auto Lincoln</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {navigation.map((item) => (
          <div key={item.to}>
            <NavLink to={item.to} end={item.to === '/'} className={linkClass}>
              {item.label}
            </NavLink>
            {item.children && (
              <div className="mt-1 ml-3 space-y-1 border-l border-line pl-3">
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.to === '/'}
                    className={linkClass}
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="border-t border-line p-3">
        <NavLink to="/support" className={linkClass}>
          Support
        </NavLink>
      </div>
    </aside>
  )
}
