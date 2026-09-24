import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navigate, Outlet } from '@tanstack/react-router'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <Spinner label="Перевіряємо сесію…" />

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}
