import { act, renderHook } from '@testing-library/react'
import { PHONE_SCREEN } from '../mediaQueries'
import { useMediaQuery } from '../useMediaQuery'

function stubMatchMedia(initial: boolean) {
  const listeners = new Set<() => void>()
  const state = { matches: initial }

  const matchMedia = vi.fn((query: string) => ({
    media: query,
    get matches() {
      return state.matches
    },
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  }))
  vi.stubGlobal('matchMedia', matchMedia)

  return {
    matchMedia,
    listeners,
    change(matches: boolean) {
      state.matches = matches
      listeners.forEach((listener) => listener())
    },
  }
}

describe('useMediaQuery', () => {
  it('returns true when the query matches', () => {
    stubMatchMedia(true)

    const { result } = renderHook(() => useMediaQuery(PHONE_SCREEN))

    expect(result.current).toBe(true)
  })

  it('returns false when the query does not match', () => {
    const media = stubMatchMedia(false)

    const { result } = renderHook(() => useMediaQuery(PHONE_SCREEN))

    expect(result.current).toBe(false)
    expect(media.matchMedia).toHaveBeenCalledWith(PHONE_SCREEN)
  })

  it('updates when the screen size changes', () => {
    const media = stubMatchMedia(false)
    const { result } = renderHook(() => useMediaQuery(PHONE_SCREEN))

    act(() => media.change(true))

    expect(result.current).toBe(true)
  })

  it('unsubscribes on unmount', () => {
    const media = stubMatchMedia(false)
    const { unmount } = renderHook(() => useMediaQuery(PHONE_SCREEN))
    expect(media.listeners.size).toBe(1)

    unmount()

    expect(media.listeners.size).toBe(0)
  })
})
