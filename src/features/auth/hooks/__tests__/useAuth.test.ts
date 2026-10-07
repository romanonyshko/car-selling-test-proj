import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { user } from '@/test/fixtures/auth'
import { fetchCurrentUser } from '../../api/authApi'
import { useAuth } from '../useAuth'

vi.mock('../../api/authApi')

describe('useAuth', () => {
  it('is loading while the current user is requested', () => {
    vi.mocked(fetchCurrentUser).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

    expect(result.current).toEqual({ user: null, isLoading: true })
  })

  it('returns the logged in user', async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(user)

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user).toEqual(user)
  })

  it('returns null when nobody is logged in', async () => {
    vi.mocked(fetchCurrentUser).mockResolvedValue(null)

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user).toBeNull()
  })

  it('returns null when the request fails', async () => {
    vi.mocked(fetchCurrentUser).mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useAuth(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.user).toBeNull()
  })
})
