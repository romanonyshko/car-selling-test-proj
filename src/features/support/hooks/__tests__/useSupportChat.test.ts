import type { ServerChatEvent } from '@auto-lincoln/contracts'
import { act, renderHook } from '@testing-library/react'
import { connectChat } from '../../api/chatSocket'
import { useSupportChat } from '../useSupportChat'

vi.mock('../../api/chatSocket')

const CLIENT_ID = '1b2c3d4e-0000-4000-8000-000000000051'
const SENT_AT = '2026-10-07T12:00:00.000Z'

const send = vi.fn()
const close = vi.fn()

function setup() {
  vi.mocked(connectChat).mockReturnValue({ send, close })
  const hook = renderHook(() => useSupportChat())
  const handlers = vi.mocked(connectChat).mock.calls[0][0]
  return { ...hook, handlers }
}

describe('useSupportChat', () => {
  beforeEach(() => {
    vi.spyOn(crypto, 'randomUUID').mockReturnValue(CLIENT_ID)
    vi.useFakeTimers({ toFake: ['Date'] })
    vi.setSystemTime(new Date(SENT_AT))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('connects once on mount and starts in the connecting state', () => {
    const { result } = setup()

    expect(connectChat).toHaveBeenCalledTimes(1)
    expect(result.current.connectionStatus).toBe('connecting')
    expect(result.current.messages).toEqual([])
    expect(result.current.closeCode).toBeNull()
  })

  it('becomes open when the socket opens', () => {
    const { result, handlers } = setup()

    act(() => handlers.onOpen())

    expect(result.current.connectionStatus).toBe('open')
  })

  it('stores the close code when the socket closes', () => {
    const { result, handlers } = setup()

    act(() => handlers.onClose(1006))

    expect(result.current.connectionStatus).toBe('closed')
    expect(result.current.closeCode).toBe(1006)
  })

  it('adds a pending message and sends it through the socket', () => {
    const { result, handlers } = setup()
    act(() => handlers.onOpen())

    act(() => result.current.sendMessage('Hello'))

    expect(result.current.messages).toEqual([
      { id: CLIENT_ID, clientId: CLIENT_ID, author: 'user', text: 'Hello', sentAt: SENT_AT, status: 'pending' },
    ])
    expect(send).toHaveBeenCalledWith({ type: 'message:send', clientId: CLIENT_ID, text: 'Hello' })
  })

  it('ignores messages while the connection is not open', () => {
    const { result } = setup()

    act(() => result.current.sendMessage('Hello'))

    expect(result.current.messages).toEqual([])
    expect(send).not.toHaveBeenCalled()
  })

  it('ignores blank messages', () => {
    const { result, handlers } = setup()
    act(() => handlers.onOpen())

    act(() => result.current.sendMessage('   '))

    expect(result.current.messages).toEqual([])
    expect(send).not.toHaveBeenCalled()
  })

  it('appends incoming server messages', () => {
    const { result, handlers } = setup()
    const event: ServerChatEvent = {
      type: 'message:new',
      message: { id: '1b2c3d4e-0000-4000-8000-000000000052', author: 'support', text: 'Hi!', sentAt: SENT_AT },
    }

    act(() => handlers.onEvent(event))

    expect(result.current.messages).toEqual([{ ...event.message, status: 'sent' }])
  })

  it('closes the connection on unmount', () => {
    const { unmount } = setup()

    unmount()

    expect(close).toHaveBeenCalledTimes(1)
  })
})
