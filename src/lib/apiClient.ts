import { API_PREFIX, type ApiErrorBody } from '@auto-lincoln/contracts'
import { getBackend } from './backend'

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

/** Calls the currently selected backend: /api/<backend><path>. */
export async function apiRequest<T>(
  path: string,
  { method = 'GET', body }: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_PREFIX}/${getBackend()}${path}`, {
    method,
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
