import { useAuth } from '@/features/auth/hooks/useAuth'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { Navigate } from 'react-router-dom'

export function LoginPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null
  if (user) return <Navigate to="/" replace />

  return (
    <div className="grid h-full place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Auto Lincoln</h1>
        <p className="mb-6 text-sm text-slate-500">Увійдіть у панель керування</p>
        <LoginForm />
      </div>
    </div>
  )
}
