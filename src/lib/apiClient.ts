import { API_PREFIX, type ApiError as ApiErrorBody } from '@auto-lincoln/contracts'

/**
 * Where the API lives. The browser calls it directly — there is no dev
 * proxy in between. The API allows this origin via CORS (`CORS_ORIGIN`
 * in its `.env`).
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3002'

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

/** Calls the API: <API URL>/api<path>. */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const url = `${API_URL}${API_PREFIX}${path}`

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
