import { existsSync } from 'node:fs'
import { hashPassword } from '@auto-lincoln/auth'
import { createPrismaClient } from '../src/index.js'

if (existsSync('.env')) process.loadEnvFile('.env')

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

const prisma = createPrismaClient(required('DATABASE_URL'))
const email = required('SEED_ADMIN_EMAIL')

await prisma.user.upsert({
  where: { email },
  update: {},
  create: {
    email,
    displayName: 'Admin',
    role: 'admin',
    passwordHash: await hashPassword(required('SEED_ADMIN_PASSWORD')),
  },
})

console.log(`Seeded admin: ${email}`)
await prisma.$disconnect()
