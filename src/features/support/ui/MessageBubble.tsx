import { cn } from '@/lib/cn'
import type { ChatItem, MessageStatus } from '@/features/support/model/chatReducer'

type MessageBubbleProps = Pick<ChatItem, 'author' | 'text' | 'status' | 'error'>

const alignments: Record<ChatItem['author'], string> = {
  user: 'self-end items-end',
  support: 'self-start items-start',
}

const bubbleColors: Record<ChatItem['author'], string> = {
  user: 'bg-accent text-white',
  support: 'bg-field text-ink',
}

const statusLabels: Record<MessageStatus, string> = {
  pending: 'Sending…',
  sent: 'Sent',
  failed: 'Not sent',
}

const statusColors: Record<MessageStatus, string> = {
  pending: 'text-ink-muted',
  sent: 'text-ink-subtle',
  failed: 'text-danger',
}

export function MessageBubble({ author, text, status, error }: MessageBubbleProps) {
  return (
    <li className={cn('flex max-w-[70%] flex-col gap-1', alignments[author])}>
      <p
        className={cn(
          'px-4 py-3 text-section break-words whitespace-pre-wrap',
          bubbleColors[author],
          status === 'pending' && 'opacity-60',
        )}
      >
        {text}
      </p>

      <span className={cn('text-crumb', statusColors[status])}>
        {error ?? statusLabels[status]}
      </span>
    </li>
  )
}
