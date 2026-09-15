import type { AppUser } from './models.js'

/**
 * REST contract. Both APIs implement exactly these routes, so the web app
 * can switch between them by changing only the base URL.
 */

export const BACKENDS = ['express', 'nest'] as const
export type Backend = (typeof BACKENDS)[number]

/** Both APIs mount every route under this prefix. */
export const API_PREFIX = '/api'

export const API_ROUTES = {
  health: '/health',
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
  },
} as const

/** httpOnly cookie holding the JWT. Same name and secret in both APIs. */
export const AUTH_COOKIE_NAME = 'al_session'

export interface HealthResponse {
  status: 'ok'
  backend: Backend
}

export interface LoginRequest {
  email: string
  password: string
}

export type AuthUser = AppUser

export interface ApiErrorBody {
  message: string
}
