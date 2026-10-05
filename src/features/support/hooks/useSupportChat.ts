import { useEffect, useReducer, useRef } from 'react';
import { chatReducer, initialChatState } from '@/features/support/model/chatReducer';
import { connectChat } from '@/features/support/api/chatSocket';

export function useSupportChat() {
    const [state, dispatch] = useReducer(chatReducer, initialChatState);
    const connectionRef = useRef<ReturnType<typeof connectChat> | null>(null)

    useEffect(() => {
        const connection = connectChat({
            onOpen: () => dispatch({ type: 'connection/open' }),
            onEvent: (event) => dispatch({ type: 'server/event', event }),
            onClose: (code) => dispatch({ type: 'connection/closed', code })
        })

        connectionRef.current = connection
        return () => {
            connectionRef.current?.close()
            connectionRef.current = null
        }
    }, [])

    function sendMessage(text: string): void {
        if (state.connectionStatus !== 'open') return
        if (!text.trim().length) return
        const clientId = crypto.randomUUID()
        const sentAt = new Date().toISOString()

        dispatch({ type: 'message/sent', clientId, text, sentAt })

        connectionRef.current?.send({ type: 'message:send', clientId, text })
    }

    return {
        messages: state.messages,
        connectionStatus: state.connectionStatus,
        closeCode: state.socketClosureCode,
        sendMessage
    }
}