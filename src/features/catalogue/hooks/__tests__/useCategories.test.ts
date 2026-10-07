import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { categories } from '@/test/fixtures/catalogue'
import { fetchCategories } from '../../api/catalogueApi'
import { useCategories } from '../useCategories'

vi.mock('../../api/catalogueApi')

describe('useCategories', () => {
  it('returns categories on success', async () => {
    vi.mocked(fetchCategories).mockResolvedValue(categories)

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(categories)
    expect(fetchCategories).toHaveBeenCalledTimes(1)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchCategories).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCategories(), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.message).toBe('Network error')
  })
})
