import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { carmakers } from '@/test/fixtures/catalogue'
import { fetchCarmakers } from '../../api/carmakersApi'
import { useCarmakers } from '../useCarmakers'

vi.mock('../../api/carmakersApi')

describe('useCarmakers', () => {
  it('returns carmakers on success', async () => {
    vi.mocked(fetchCarmakers).mockResolvedValue(carmakers)

    const { result } = renderHook(() => useCarmakers(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(carmakers)
    expect(fetchCarmakers).toHaveBeenCalledTimes(1)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchCarmakers).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCarmakers(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Network error')
  })
})
