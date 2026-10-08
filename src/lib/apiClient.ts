import { API_PREFIX, type ApiError as ApiErrorBody } from '@auto-lincoln/contracts'

/**
 * Where the API lives. In dev the browser calls it directly (the API allows
 * this origin via `CORS_ORIGIN` in its `.env`). In a production build it is
 * the app's own domain: vercel.json forwards /api to the API, so the session
 * cookie stays first-party.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:3002' : '')

/** Vercel cannot proxy WebSockets, so in production the chat connects to the API domain directly. */
export const WS_URL = import.meta.env.VITE_WS_URL ?? API_URL.replace(/^http/, 'ws')

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const url = `${API_URL}${API_PREFIX}${path}`

  const response = await fetch(url, {
    method,
    // In dev the API is on another origin: without this the browser neither
    // sends the al_session cookie nor stores the one from Set-Cookie.
    credentials: 'include',
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as ApiErrorBody | null
    throw new ApiError(response.status, errorBody?.message ?? response.statusText)
  }

  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}
