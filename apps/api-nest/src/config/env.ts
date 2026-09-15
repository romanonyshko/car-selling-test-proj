import { existsSync } from 'node:fs'

if (existsSync('.env')) process.loadEnvFile('.env')

function required(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing environment variable ${name}`)
  return value
}

export const env = {
  port: Number(process.env.PORT ?? 3002),
  databaseUrl: required('DATABASE_URL'),
  jwtSecret: required('JWT_SECRET'),
}
