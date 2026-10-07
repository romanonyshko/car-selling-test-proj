import { act, renderHook, waitFor } from '@testing-library/react'
import { useNavigate } from '@tanstack/react-router'
import { queryClient } from '@/lib/queryClient'
import { createWrapper } from '@/test/createWrapper'
import { credentials, user } from '@/test/fixtures/auth'
import { login, logout } from '../../api/authApi'
import { authKeys } from '../../api/authKeys'
import { useLogin, useLogout } from '../useLogin'

vi.mock('../../api/authApi')
vi.mock('@tanstack/react-router', () => ({ useNavigate: vi.fn() }))

const navigate = vi.fn()

beforeEach(() => {
  vi.mocked(useNavigate).mockReturnValue(navigate)
})

afterEach(() => {
  queryClient.clear()
})

describe('useLogin', () => {
  it('stores the user and redirects to the dashboard on success', async () => {
    vi.mocked(login).mockResolvedValue(user)

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
    act(() => result.current.mutate(credentials))

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(vi.mocked(login).mock.calls[0][0]).toEqual(credentials)
    expect(queryClient.getQueryData(authKeys.me())).toEqual(user)
    expect(navigate).toHaveBeenCalledWith({ to: '/dashboard', replace: true })
  })

  it('does not redirect when login fails', async () => {
    vi.mocked(login).mockRejectedValue(new Error('Invalid credentials'))

    const { result } = renderHook(() => useLogin(), { wrapper: createWrapper() })
    act(() => result.current.mutate(credentials))

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Invalid credentials')
    expect(queryClient.getQueryData(authKeys.me())).toBeUndefined()
    expect(navigate).not.toHaveBeenCalled()
  })
})

describe('useLogout', () => {
  it('clears the cache, resets the user and redirects to login', async () => {
    vi.mocked(logout).mockResolvedValue()
    queryClient.setQueryData(authKeys.me(), user)
    queryClient.setQueryData(['dashboard'], { cached: true })

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
    act(() => result.current.mutate())

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(queryClient.getQueryData(authKeys.me())).toBeNull()
    expect(queryClient.getQueryData(['dashboard'])).toBeUndefined()
    expect(navigate).toHaveBeenCalledWith({ to: '/login', replace: true })
  })

  it('keeps the session when logout fails', async () => {
    vi.mocked(logout).mockRejectedValue(new Error('Server error'))
    queryClient.setQueryData(authKeys.me(), user)

    const { result } = renderHook(() => useLogout(), { wrapper: createWrapper() })
    act(() => result.current.mutate())

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(queryClient.getQueryData(authKeys.me())).toEqual(user)
    expect(navigate).not.toHaveBeenCalled()
  })
})
