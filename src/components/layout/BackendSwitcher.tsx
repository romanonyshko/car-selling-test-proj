import { setBackend, useBackend } from '@/lib/backend'
import { cn } from '@/lib/cn'
import { queryClient } from '@/lib/queryClient'
import { BACKENDS, type Backend } from '@auto-lincoln/contracts'

const labels: Record<Backend, string> = {
  express: 'Express',
  nest: 'NestJS',
}

export function BackendSwitcher() {
  const backend = useBackend()

  function handleSelect(next: Backend) {
    if (next === backend) return
    setBackend(next)
    // Data from one backend must not be shown as data from the other.
    queryClient.resetQueries()
  }

  return (
    <div
      role="radiogroup"
      aria-label="Backend"
      className="flex h-[44px] items-center border border-line bg-field p-1"
    >
      {BACKENDS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === backend}
          onClick={() => handleSelect(option)}
          className={cn(
            'h-full px-4 text-crumb font-medium transition-colors',
            option === backend
              ? 'bg-surface text-accent shadow-card-1'
              : 'text-ink-muted hover:text-ink',
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  )
}
