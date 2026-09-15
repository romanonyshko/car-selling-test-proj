import { SESSION_MAX_AGE_MS, signSession } from '@auto-lincoln/auth'
import { API_ROUTES, AUTH_COOKIE_NAME } from '@auto-lincoln/shared'
import type { AuthUser, LoginRequest } from '@auto-lincoln/shared'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import type { Response } from 'express'
import { env } from '../config/env.js'
import { AuthGuard } from './auth.guard.js'
import { AuthService } from './auth.service.js'
import type { Session } from './auth.types.js'
import { CurrentSession } from './current-session.decorator.js'
import { toAuthUser } from './to-auth-user.js'

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post(API_ROUTES.auth.login)
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() body: Partial<LoginRequest> | undefined,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AuthUser> {
    const { email, password } = body ?? {}
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new BadRequestException('Email and password are required')
    }

    const user = await this.authService.validateCredentials(email, password)
    if (!user) {
      throw new UnauthorizedException('Invalid email or password')
    }

    const token = await signSession(user.id, user.role, env.jwtSecret)
    res.cookie(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: SESSION_MAX_AGE_MS,
    })

    return toAuthUser(user)
  }

  @Get(API_ROUTES.auth.me)
  @UseGuards(AuthGuard)
  async me(@CurrentSession() session: Session): Promise<AuthUser> {
    const user = await this.authService.findById(session.userId)
    if (!user) {
      throw new UnauthorizedException('Not authenticated')
    }
    return toAuthUser(user)
  }

  @Post(API_ROUTES.auth.logout)
  @HttpCode(HttpStatus.NO_CONTENT)
  logout(@Res({ passthrough: true }) res: Response): void {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' })
  }
}
