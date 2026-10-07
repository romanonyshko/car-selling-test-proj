import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { dashboard } from '@/test/fixtures/dashboard'
import { fetchDashboard } from '../../api/dashboardApi'
import { useDashboard } from '../useDashboard'

vi.mock('../../api/dashboardApi')

describe('useDashboard', () => {
  it('returns dashboard data on success', async () => {
    vi.mocked(fetchDashboard).mockResolvedValue(dashboard)

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(dashboard)
    expect(fetchDashboard).toHaveBeenCalledTimes(1)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchDashboard).mockRejectedValue(new Error('Server error'))

    const { result } = renderHook(() => useDashboard(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Server error')
  })
})
