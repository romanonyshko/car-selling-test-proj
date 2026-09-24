import { queryOptions } from '@tanstack/react-query'
import { fetchCurrentUser } from './authApi'
import { authKeys } from './authKeys'

export const meQueryOptions = queryOptions({
  queryKey: authKeys.me(),
  queryFn: fetchCurrentUser,
  retry: false,
})
