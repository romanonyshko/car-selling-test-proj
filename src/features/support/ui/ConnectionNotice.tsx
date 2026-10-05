interface ConnectionNoticeProps {
  closeCode: number | null
}

const closeMessages: Record<number, string> = {
  4401: 'Сесія закінчилась. Увійдіть знову.',
  4403: 'Доступ заборонено.',
  1006: 'Немає звʼязку з сервером. Оновіть сторінку.',
}

const fallbackMessage = 'Зʼєднання закрито. Оновіть сторінку.'

export function ConnectionNotice({ closeCode }: ConnectionNoticeProps) {
  if (closeCode === null) return null

  return (
    <p role="alert" className="border-b border-line px-5 py-3 text-crumb text-danger">
      {closeMessages[closeCode] ?? fallbackMessage}
    </p>
  )
}
