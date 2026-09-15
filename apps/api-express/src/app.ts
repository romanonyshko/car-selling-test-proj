import { API_PREFIX } from '@auto-lincoln/shared'
import express from 'express'
import { healthRouter } from './routes/health.js'

export function createApp() {
  const app = express()

  app.use(express.json())
  app.use(API_PREFIX, healthRouter)

  return app
}
