/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the Express API, e.g. http://localhost:3001 */
  readonly VITE_EXPRESS_API_URL?: string
  /** Base URL of the NestJS API, e.g. http://localhost:3002 */
  readonly VITE_NEST_API_URL?: string
}
