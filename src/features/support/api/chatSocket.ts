import { ApiError, apiRequest, WS_URL } from '@/lib/apiClient'
import { API_ROUTES, WS_ROUTES, WS_TICKET_PARAM, type ClientChatEvent, type ServerChatEvent, type WsTicketResponse } from '@auto-lincoln/contracts'

interface ChatSocketHandlers  {
 onOpen: () => void
 onEvent: (event: ServerChatEvent) => void
 onClose: (code: number) => void
}

export function connectChat ({onOpen, onEvent, onClose}: ChatSocketHandlers){
    let socket: WebSocket | null = null
    let closed = false

    // In production the session cookie belongs to the web app's domain and is
    // not sent to the API's domain with the handshake, so a ticket proves who we are.
    apiRequest<WsTicketResponse>(API_ROUTES.auth.wsTicket, { method: 'POST' })
        .then(({ ticket }) => {
            if (closed) return
            socket = new WebSocket(`${WS_URL}${WS_ROUTES.chat}?${WS_TICKET_PARAM}=${encodeURIComponent(ticket)}`)

            socket.onopen = () => onOpen()
            socket.onmessage = (event) => onEvent(JSON.parse(event.data) as ServerChatEvent)
            socket.onclose = (event) => onClose(event.code)
        })
        .catch((error: unknown) => {
            if (closed) return
            onClose(error instanceof ApiError && error.status === 401 ? 4401 : 1006)
        })

    return {
        send: (event:ClientChatEvent) => socket?.send(JSON.stringify(event)),
        close: () => {
            closed = true
            if (!socket) return
            socket.onclose = null
            socket.onmessage = null
            socket.onopen= null
            socket.close()
        }
    }   
}
