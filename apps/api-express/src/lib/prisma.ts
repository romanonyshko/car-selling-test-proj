import { createPrismaClient } from '@auto-lincoln/db'
import { env } from '../config/env.js'

export const prisma = createPrismaClient(env.databaseUrl)
