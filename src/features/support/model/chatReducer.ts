import type { ChatMessage, ServerChatEvent } from "@auto-lincoln/contracts"

export type ConnectionStatus = 'connecting' | 'open' | 'closed'

export type MessageStatus = 'pending' | 'sent' | 'failed'

export type ChatAction =
    | { type: 'connection/open' }
    | { type: 'connection/closed', code: number }
    | { type: 'message/sent', clientId: string, text: string, sentAt: string }
    | { type: 'server/event', event: ServerChatEvent }


export interface ChatItem {
    id: string
    author: ChatMessage['author']
    text: string
    sentAt: string
    status: MessageStatus
    error?: string
    clientId?: string
}

export interface ChatState {
    connectionStatus: ConnectionStatus
    socketClosureCode: number | null
    messages: ChatItem[]
}

export const initialChatState: ChatState = {
    connectionStatus: 'connecting',
    socketClosureCode: null,
    messages: []
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
    switch (action.type) {
        case 'connection/open': return {
            connectionStatus: 'open',
            socketClosureCode: null,
            messages: state.messages
        };
        case 'connection/closed': return {
            connectionStatus: 'closed',
            socketClosureCode: action.code,
            messages: state.messages
        };
        case 'message/sent': return {
            connectionStatus: state.connectionStatus,
            socketClosureCode:  state.socketClosureCode,
            messages: [...state.messages, {
                id: action.clientId,
                clientId: action.clientId,
                author: 'user',
                text: action.text,
                sentAt: action.sentAt,
                status: 'pending'
            }]
        };
        case 'server/event': 
            switch (action.event.type) {
                case 'message:new': {
                    const incoming = action.event.message
                    const isConfirmation = incoming.clientId !== undefined
                        && state.messages.some(m => m.clientId === incoming.clientId)

                    if (isConfirmation && incoming.author === 'support') {
                        return {
                            ...state,
                            messages: [
                                ...state.messages.map(m =>
                                    m.clientId === incoming.clientId
                                        ? { ...m, status: 'sent' as const }
                                        : m
                                ),
                                { ...incoming, clientId: undefined, status: 'sent' },
                            ]
                        }
                    }

                    if (isConfirmation) {
                        return {
                            ...state,
                            messages: state.messages.map(m =>
                                m.clientId === incoming.clientId
                                    ? { ...m, id: incoming.id, sentAt: incoming.sentAt, status: 'sent' }
                                    : m
                            )
                        }
                    }

                    return {
                        ...state,
                        messages: [...state.messages, { ...incoming, status: 'sent' }]
                    }
                }

                case 'error': {
                    const { clientId, message } = action.event
                    if (clientId === undefined) return state

                    return {
                        ...state,
                        messages: state.messages.map(m =>
                            m.clientId === clientId
                                ? { ...m, status: 'failed', error: message }
                                : m
                        )
                    }
                }

                default:
                    return state
            }


        default:
            return state;
    }
}

