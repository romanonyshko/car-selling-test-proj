import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

export function ProtectedRoute() {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return <Spinner label="Перевіряємо сесію…" />

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />

  return <Outlet />
}
