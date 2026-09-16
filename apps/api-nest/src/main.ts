// env must be imported first: it loads .env before anything reads process.env.
import { env } from './config/env.js'
import 'reflect-metadata'
import { API_PREFIX } from '@auto-lincoln/shared'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module.js'
import cookieParser from 'cookie-parser'

const app = await NestFactory.create(AppModule)
app.setGlobalPrefix(API_PREFIX)
app.use(cookieParser())
await app.listen(env.port)

console.log(`api-nest listening on http://localhost:${env.port}`)
