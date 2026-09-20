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
      className="size-6 text-ink-muted"
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
      className={cn('size-[25px] transition-transform', isOpen && 'rotate-180')}
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
    <header className="flex h-header shrink-0 items-center justify-end gap-[15px] border-b border-line bg-surface pr-[40px]">
      <BackendSwitcher />
      <CartIcon />

      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="flex items-center gap-[5px] text-greeting font-medium text-accent transition-opacity hover:opacity-80"
        >
          Hello, {greetingName}
          <ChevronDownIcon isOpen={isMenuOpen} />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 z-10 mt-3 w-[220px] border border-line bg-surface shadow-card-1"
          >
            <p className="border-b border-line px-5 py-3 text-crumb break-words text-ink-muted">
              {user?.email ?? 'guest'}
            </p>

            <button
              type="button"
              role="menuitem"
              disabled={logout.isPending}
              onClick={() => logout.mutate()}
              className="flex w-full items-center gap-2 px-5 py-3 text-left text-crumb text-ink transition-colors hover:bg-field disabled:cursor-not-allowed disabled:opacity-60"
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
