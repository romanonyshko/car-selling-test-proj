import { createPrismaClient, PrismaClient } from '@auto-lincoln/db'
import { Global, Module } from '@nestjs/common'
import { env } from '../config/env.js'

/** Inject with `constructor(private readonly prisma: PrismaClient)`. */
@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => createPrismaClient(env.databaseUrl),
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
