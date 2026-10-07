import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { engines, MODEL_ID } from '@/test/fixtures/catalogue'
import { fetchEngines } from '../../api/enginesApi'
import { useEngines } from '../useEngines'

vi.mock('../../api/enginesApi')

describe('useEngines', () => {
  it('does not fetch until a model is selected', () => {
    const { result } = renderHook(() => useEngines(), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
    expect(fetchEngines).not.toHaveBeenCalled()
  })

  it('fetches engines of the selected model', async () => {
    vi.mocked(fetchEngines).mockResolvedValue(engines)

    const { result } = renderHook(() => useEngines(MODEL_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(engines)
    expect(fetchEngines).toHaveBeenCalledWith(MODEL_ID)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchEngines).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useEngines(MODEL_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
