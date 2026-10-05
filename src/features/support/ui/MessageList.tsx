import { useEffect, useRef } from 'react'
import { MessageBubble } from '@/features/support/ui/MessageBubble'
import type { ChatItem } from '@/features/support/model/chatReducer'

interface MessageListProps {
  messages: ChatItem[]
}

export function MessageList({ messages }: MessageListProps) {
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messages.length])

  return (
    <ul ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-5">
      {messages.map(message => <MessageBubble
        key={message.id}
        author={message.author}
        text={message.text}
        status={message.status}
        error={message.error}
      />)
      }
    </ul>
  )
}
