import { setBackend, useBackend } from '@/lib/backend'
import { cn } from '@/lib/cn'
import { queryClient } from '@/lib/queryClient'
import { BACKENDS, type Backend } from '@auto-lincoln/shared'

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
      className="flex h-10 items-center gap-1 rounded-lg border border-line bg-canvas p-1"
    >
      {BACKENDS.map((option) => (
        <button
          key={option}
          type="button"
          role="radio"
          aria-checked={option === backend}
          onClick={() => handleSelect(option)}
          className={cn(
            'h-full rounded-md px-3 text-sm font-medium transition-colors',
            option === backend
              ? 'bg-white text-brand-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700',
          )}
        >
          {labels[option]}
        </button>
      ))}
    </div>
  )
}
