import { renderHook } from '@testing-library/react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCarFilters } from '../useCarFilters'

vi.mock('@tanstack/react-router', () => ({ useNavigate: vi.fn(), useSearch: vi.fn() }))

type Search = Record<string, string | undefined>

const navigate = vi.fn()
const current: Search = { make: 'ford', model: 'focus', engine: 'ecoboost', category: 'brakes' }

function setup(search: Search = current) {
  vi.mocked(useSearch).mockReturnValue(search)
  vi.mocked(useNavigate).mockReturnValue(navigate)
  return renderHook(() => useCarFilters()).result
}

function nextSearch(): Search {
  const options = navigate.mock.lastCall?.[0]
  return options.search(current)
}

describe('useCarFilters', () => {
  it('exposes the current search params as filters', () => {
    const result = setup()

    expect(result.current.filters).toEqual(current)
  })

  it('replaces the history entry instead of pushing a new one', () => {
    const result = setup()

    result.current.setMake('lincoln')

    expect(navigate).toHaveBeenCalledWith(expect.objectContaining({ to: '.', replace: true }))
  })

  it('setMake selects a make and drops model and engine', () => {
    const result = setup()

    result.current.setMake('lincoln')

    expect(nextSearch()).toEqual({ make: 'lincoln', model: undefined, engine: undefined, category: 'brakes' })
  })

  it('setModel keeps the make and drops the engine', () => {
    const result = setup()

    result.current.setModel('fiesta')

    expect(nextSearch()).toEqual({ make: 'ford', model: 'fiesta', engine: undefined, category: 'brakes' })
  })

  it('setEngine keeps make and model', () => {
    const result = setup()

    result.current.setEngine('v8')

    expect(nextSearch()).toEqual({ make: 'ford', model: 'focus', engine: 'v8', category: 'brakes' })
  })

  it.each(['setMake', 'setModel', 'setEngine'] as const)('%s turns an empty selection into undefined', (setter) => {
    const result = setup()
    const key = { setMake: 'make', setModel: 'model', setEngine: 'engine' }[setter]

    result.current[setter]('')

    expect(nextSearch()[key]).toBeUndefined()
  })

  it('reset clears the car filters but keeps other params', () => {
    const result = setup()

    result.current.reset()

    expect(nextSearch()).toEqual({ make: undefined, model: undefined, engine: undefined, category: 'brakes' })
  })
})
