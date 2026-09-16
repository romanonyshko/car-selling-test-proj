import type { verifySession } from '@auto-lincoln/auth'
import type { Request } from 'express'

/** What the guard puts into the request: `{ userId, role }`. */
export type Session = Awaited<ReturnType<typeof verifySession>>

export interface AuthenticatedRequest extends Request {
  authSession: Session
}
