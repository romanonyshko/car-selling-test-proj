/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the API, e.g. http://localhost:3002 */
  readonly VITE_API_URL?: string
  /** Base URL of the chat WebSocket, e.g. wss://auto-lincoln-api.onrender.com */
  readonly VITE_WS_URL?: string
}
