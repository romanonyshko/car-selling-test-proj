import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { AuthenticatedRequest, Session } from './auth.types.js'

/** Use only on routes protected by AuthGuard — it fills `authSession`. */
export const CurrentSession = createParamDecorator(
  (_data: unknown, context: ExecutionContext): Session => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    return request.authSession
  },
)
