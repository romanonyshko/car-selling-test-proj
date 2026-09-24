import { queryClient } from '@/lib/queryClient'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { login, logout } from '../api/authApi'
import { authKeys } from '../api/authKeys'

export function useLogin() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(authKeys.me(), user)
      navigate({ to: '/', replace: true })
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear()
      queryClient.setQueryData(authKeys.me(), null)
      navigate({ to: '/login', replace: true })
    },
  })
}
