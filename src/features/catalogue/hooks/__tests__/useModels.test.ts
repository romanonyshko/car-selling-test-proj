import { renderHook, waitFor } from '@testing-library/react'
import { createWrapper } from '@/test/createWrapper'
import { CARMAKER_ID, models } from '@/test/fixtures/catalogue'
import { fetchModels } from '../../api/modelsApi'
import { useModels } from '../useModels'

vi.mock('../../api/modelsApi')

describe('useModels', () => {
  it('does not fetch until a carmaker is selected', () => {
    const { result } = renderHook(() => useModels(), { wrapper: createWrapper() })

    expect(result.current.fetchStatus).toBe('idle')
    expect(result.current.data).toBeUndefined()
    expect(fetchModels).not.toHaveBeenCalled()
  })

  it('fetches models of the selected carmaker', async () => {
    vi.mocked(fetchModels).mockResolvedValue(models)

    const { result } = renderHook(() => useModels(CARMAKER_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual(models)
    expect(fetchModels).toHaveBeenCalledWith(CARMAKER_ID)
  })

  it('starts fetching once the carmaker appears', async () => {
    vi.mocked(fetchModels).mockResolvedValue(models)

    const { result, rerender } = renderHook(({ id }) => useModels(id), {
      wrapper: createWrapper(),
      initialProps: { id: undefined as string | undefined },
    })
    expect(fetchModels).not.toHaveBeenCalled()

    rerender({ id: CARMAKER_ID })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetchModels).toHaveBeenCalledWith(CARMAKER_ID)
  })

  it('sets error state when request fails', async () => {
    vi.mocked(fetchModels).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useModels(CARMAKER_ID), { wrapper: createWrapper() })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
