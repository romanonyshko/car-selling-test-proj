import { cn } from '@/lib/cn'
import type { ConnectionStatus } from '@/features/support/model/chatReducer'

interface ConnectionBadgeProps {
  status: ConnectionStatus
}

const dotColors: Record<ConnectionStatus, string> = {
  connecting: 'bg-ink-subtle animate-pulse',
  open: 'bg-positive',
  closed: 'bg-danger',
}

const labels: Record<ConnectionStatus, string> = {
  connecting: 'Підключення…',
  open: 'Онлайн',
  closed: 'Відключено',
}

export function ConnectionBadge({ status }: ConnectionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-crumb text-ink-muted">
      <span aria-hidden className={cn('size-2 rounded-full', dotColors[status])} />
      {labels[status]}
    </span>
  )
}
