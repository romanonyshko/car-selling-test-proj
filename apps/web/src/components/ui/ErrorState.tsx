import { Button } from './Button'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <p className="text-crumb text-danger">
        {message ?? 'Не вдалося завантажити дані.'}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Спробувати ще раз
        </Button>
      )}
    </div>
  )
}
