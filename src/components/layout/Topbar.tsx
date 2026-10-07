import { BurgerIcon } from '@/components/icons/BurgerIcon'
import { CartIcon } from '@/components/icons/CartIcon'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useLogout } from '@/features/auth/hooks/useLogin'
import { cn } from '@/lib/cn'
import { useEffect, useRef, useState } from 'react'
import logo from '@/assets/logo.png'

export function Topbar({ onMenuOpen }: { onMenuOpen: () => void }) {
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

  const greetingName = user?.name ?? user?.email ?? 'guest'

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-[15px] border-b border-line bg-surface px-4 sm:h-header sm:pr-[40px] sm:pl-0">
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuOpen}
        className="grid size-9 shrink-0 place-items-center text-ink-muted transition-colors hover:text-ink sm:hidden"
      >
        <span className="size-6">
          <BurgerIcon />
        </span>
      </button>
      <img src={logo} alt="Auto Detail" className="mr-auto h-8 w-auto sm:hidden" />

      <span className="size-6 shrink-0 text-ink-muted">
        <CartIcon />
      </span>

      <div ref={menuRef} className="relative min-w-0">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="flex max-w-full items-center gap-[5px] text-greeting font-medium text-accent transition-opacity hover:opacity-80"
        >
          <span className="truncate">
            <span className="max-sm:sr-only">Hello, </span>
            {greetingName}
          </span>
          <span className={cn('size-[25px] shrink-0 transition-transform', isMenuOpen && 'rotate-180')}>
            <ChevronDownIcon />
          </span>
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 z-10 mt-3 w-[220px] max-w-[calc(100vw-32px)] border border-line bg-surface shadow-card-1"
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
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
