import type { UserRole } from '@auto-lincoln/shared'

declare global {
  namespace Express {
    interface Locals {
      session?: { userId: string; role: UserRole }
    }
  }
}

export {}