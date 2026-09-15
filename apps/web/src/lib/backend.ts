import { BACKENDS, type Backend } from '@auto-lincoln/shared'
import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'auto-lincoln:backend'
const DEFAULT_BACKEND: Backend = 'express'

const listeners = new Set<() => void>()

function isBackend(value: unknown): value is Backend {
  return BACKENDS.includes(value as Backend)
}

function readStoredBackend(): Backend {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return isBackend(stored) ? stored : DEFAULT_BACKEND
  } catch {
    return DEFAULT_BACKEND
  }
}

let currentBackend = readStoredBackend()

/** Read outside React — used by apiClient. */
export function getBackend(): Backend {
  return currentBackend
}

export function setBackend(next: Backend) {
  if (next === currentBackend) return
  currentBackend = next
  try {
    localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // Storage is unavailable (private mode) — the choice lives until reload.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useBackend(): Backend {
  return useSyncExternalStore(subscribe, getBackend)
}
