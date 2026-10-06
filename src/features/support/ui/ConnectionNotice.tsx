interface ConnectionNoticeProps {
  closeCode: number | null
}

const closeMessages: Record<number, string> = {
  4401: 'Your session has expired. Please sign in again.',
  4403: 'Access denied.',
  1006: 'No connection to the server. Please refresh the page.',
}

const fallbackMessage = 'The connection was closed. Please refresh the page.'

export function ConnectionNotice({ closeCode }: ConnectionNoticeProps) {
  if (closeCode === null) return null

  return (
    <p role="alert" className="border-b border-line px-5 py-3 text-crumb text-danger">
      {closeMessages[closeCode] ?? fallbackMessage}
    </p>
  )
}
