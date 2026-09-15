import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogin'
import { cn } from '@/lib/cn'
import { useEffect, useRef, useState } from 'react'
import { BackendSwitcher } from './BackendSwitcher'

function CartIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-5 text-slate-500"
    >
      <path d="M3 4h1.8l2.3 10.2a1.5 1.5 0 0 0 1.5 1.2h7.9a1.5 1.5 0 0 0 1.4-1.1L20 7H5.6" />
      <circle cx="9.5" cy="19" r="1.4" />
      <circle cx="16.5" cy="19" r="1.4" />
    </svg>
  )
}

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        'size-4 text-slate-500 transition-transform',
        isOpen && 'rotate-180',
      )}
    >
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  )
}

export function Topbar() {
  const { user } = useAuth()
  const logout = useLogout()

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    function handleMouseDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsMenuOpen(false)
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const greetingName = user?.displayName ?? user?.email ?? 'guest'

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-4 border-b border-line bg-white px-6">
      <BackendSwitcher />
      <CartIcon />

      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-brand-600 transition-colors hover:bg-slate-100"
        >
          Hello, {greetingName}
          <ChevronDownIcon isOpen={isMenuOpen} />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 z-10 mt-2 w-48 rounded-lg border border-line bg-white shadow-sm"
          >
            <p className="border-b border-line px-3 py-2 text-xs break-words text-slate-500">
              {user?.email ?? 'guest'}
            </p>

            <button
              type="button"
              role="menuitem"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              className="flex w-full items-center gap-2 rounded-b-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {logout.isPending && (
                <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              )}
              Вийти
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
