import { ApiError, apiRequest } from '@/lib/apiClient'
import { API_ROUTES, type AuthUser, type LoginRequest } from '@auto-lincoln/shared'

export function login(payload: LoginRequest): Promise<AuthUser> {
  return apiRequest<AuthUser>(API_ROUTES.auth.login, { method: 'POST', body: payload })
}

export function logout(): Promise<void> {
  return apiRequest<void>(API_ROUTES.auth.logout, { method: 'POST' })
}

/** `null` means "no session" (401) — that is not an error. */
export async function fetchCurrentUser(): Promise<AuthUser | null> {
  try {
    return await apiRequest<AuthUser>(API_ROUTES.auth.me)
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null
    throw error
  }
}
