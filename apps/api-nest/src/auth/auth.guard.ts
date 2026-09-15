import { verifySession } from '@auto-lincoln/auth'
import { AUTH_COOKIE_NAME } from '@auto-lincoln/shared'
import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { env } from '../config/env.js'
import type { AuthenticatedRequest } from './auth.types.js'

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>()
    const token: unknown = request.cookies?.[AUTH_COOKIE_NAME]

    if (typeof token !== 'string') {
      throw new UnauthorizedException('Not authenticated')
    }

    try {
      request.authSession = await verifySession(token, env.jwtSecret)
    } catch {
      throw new UnauthorizedException('Session expired')
    }

    return true
  }
}
