import { ConnectionBadge } from '@/features/support/ui/ConnectionBadge'
import { ConnectionNotice } from '@/features/support/ui/ConnectionNotice'
import { MessageForm } from '@/features/support/ui/MessageForm'
import { MessageList } from '@/features/support/ui/MessageList'
import { useSupportChat } from '@/features/support/hooks/useSupportChat'

export function SupportChat() {
  const {
    messages,
    connectionStatus,
    closeCode,
    sendMessage
  } = useSupportChat()

  return (
    <section className="flex h-[600px] flex-col bg-surface shadow-card-1">
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
        <h2 className="text-section font-medium text-accent">Чат з підтримкою</h2>
        <ConnectionBadge status={connectionStatus} />
      </header>

      <ConnectionNotice closeCode={closeCode} />
      <MessageList messages={messages} />
      <MessageForm onSend={sendMessage} disabled={connectionStatus !== 'open'} />
    </section>
  )
}
