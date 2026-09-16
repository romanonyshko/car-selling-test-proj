import { verifyPassword } from '@auto-lincoln/auth'
import { PrismaClient, type User } from '@auto-lincoln/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  /** `null` if there is no such user or the password is wrong. */
  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) return null

    const isValid = await verifyPassword(password, user.passwordHash)
    return isValid ? user : null
  }

  findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } })
  }
}
