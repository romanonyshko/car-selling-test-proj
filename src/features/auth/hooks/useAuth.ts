import { useQuery } from '@tanstack/react-query'
import { meQueryOptions } from '../api/authQueries'

export function useAuth() {
  const { data, isLoading } = useQuery(meQueryOptions)

  return { user: data ?? null, isLoading }
}
