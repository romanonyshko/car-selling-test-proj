import { API_PREFIX } from '@auto-lincoln/shared'
import express from 'express'
import { healthRouter } from './routes/health.js'
import cookieParser from 'cookie-parser'
import { authRouter } from './modules/auth/auth.router.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(cookieParser())
  app.use(API_PREFIX, healthRouter)
  app.use(API_PREFIX ,authRouter)
  app.use(notFound)
  app.use(errorHandler)

  return app
}
