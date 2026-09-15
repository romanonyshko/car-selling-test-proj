import type { User } from '@auto-lincoln/db'
import type { AuthUser } from '@auto-lincoln/shared'

export function toAuthUser({ id, email, displayName, role }: User): AuthUser {
  return { id, email, displayName, role }
}
