import { WS_URL } from '@/lib/apiClient'
import { WS_ROUTES, type ClientChatEvent, type ServerChatEvent } from '@auto-lincoln/contracts'

interface ChatSocketHandlers  {
 onOpen: () => void
 onEvent: (event: ServerChatEvent) => void
 onClose: (code: number) => void
}

export function connectChat ({onOpen, onEvent, onClose}: ChatSocketHandlers){
    const socket = new WebSocket(`${WS_URL}${WS_ROUTES.chat}`)

    socket.onopen = () => onOpen()
    socket.onmessage = (event) => onEvent(JSON.parse(event.data) as ServerChatEvent)
    socket.onclose = (event) => onClose(event.code)

    return {
        send: (event:ClientChatEvent) => socket.send(JSON.stringify(event)),
        close: () => {
            socket.onclose = null
            socket.onmessage = null
            socket.onopen= null
            socket.close()
        }
    }   
}