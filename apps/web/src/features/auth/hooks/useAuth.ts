import { useQuery } from '@tanstack/react-query'
import { fetchCurrentUser } from '../api/authApi'
import { authKeys } from '../api/authKeys'

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    retry: false,
  })

  return { user: data ?? null, isLoading }
}
