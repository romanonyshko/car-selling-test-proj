import type { PartsQuery, PartsResponse } from '@auto-lincoln/contracts'
import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { brakeParts, CATEGORY_ID, OTHER_CATEGORY_ID, suspensionParts } from '@/test/fixtures/catalogue'
import { fetchParts } from '../../api/partsApi'
import { useParts } from '../useParts'

vi.mock('../../api/partsApi')

const brakesQuery: PartsQuery = { category: CATEGORY_ID, limit: 20 }
const suspensionQuery: PartsQuery = { category: OTHER_CATEGORY_ID, limit: 20 }

describe('useParts', () => {
  it('does not fetch without a category', () => {
    const { result } = renderHook(() => useParts({ limit: 20 }), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(fetchParts).not.toHaveBeenCalled()
  })

  it('fetches parts with the given filters', async () => {
    vi.mocked(fetchParts).mockResolvedValue(brakeParts)

    const { result } = renderHook(() => useParts(brakesQuery), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(brakeParts)
    expect(fetchParts).toHaveBeenCalledWith(brakesQuery)
  })

  it('keeps previous parts while the next filters are loading', async () => {
    let resolveNext: (value: PartsResponse) => void = () => {}
    vi.mocked(fetchParts)
      .mockResolvedValueOnce(brakeParts)
      .mockImplementationOnce(() => new Promise((resolve) => { resolveNext = resolve }))

    const { result, rerender } = renderHook(({ filters }) => useParts(filters), {
      wrapper: createWrapper(),
      initialProps: { filters: brakesQuery },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    rerender({ filters: suspensionQuery })

    await waitFor(() => expect(result.current.isFetching).toBe(true))
    expect(result.current.data).toEqual(brakeParts)
    expect(result.current.isPlaceholderData).toBe(true)

    resolveNext(suspensionParts)

    await waitFor(() => expect(result.current.data).toEqual(suspensionParts))
    expect(result.current.isPlaceholderData).toBe(false)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchParts).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useParts(brakesQuery), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
