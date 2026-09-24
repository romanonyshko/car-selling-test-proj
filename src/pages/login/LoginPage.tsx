import { BackendSwitcher } from '@/components/layout/BackendSwitcher'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { Navigate } from '@tanstack/react-router'

export function LoginPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null
  if (user) return <Navigate to="/" replace />

  return (
    <div className="grid h-full place-items-center p-6">
      <div className="w-full max-w-[419px] bg-surface p-10 shadow-card-1">
        <h1 className="text-title font-medium text-ink">Auto Lincoln</h1>
        <p className="mt-2 mb-8 text-section text-ink-muted">
          Увійдіть у панель керування
        </p>

        <div className="mb-8">
          <BackendSwitcher />
        </div>

        <LoginForm />
      </div>
    </div>
  )
}
