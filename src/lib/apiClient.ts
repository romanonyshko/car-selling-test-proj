import { API_PREFIX, type ApiErrorBody, type Backend } from '@auto-lincoln/contracts'
import { getBackend } from './backend'

/**
 * Where each backend lives. The browser calls the selected API directly
 * (express → :3001, nest → :3002) — there is no dev proxy in between.
 * The APIs allow this origin via CORS (`CORS_ORIGIN` in their `.env`).
 */
export const BACKEND_URLS: Record<Backend, string> = {
  express: import.meta.env.VITE_EXPRESS_API_URL ?? 'http://localhost:3001',
  nest: import.meta.env.VITE_NEST_API_URL ?? 'http://localhost:3002',
}

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

/** Calls the currently selected backend: <backend URL>/api<path>. */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const url = `${BACKEND_URLS[getBackend()]}${API_PREFIX}${path}`

  const response = await fetch(url, {
    method,
    // The API is on another origin: without this the browser neither sends
    // the al_session cookie nor stores the one from Set-Cookie.
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
