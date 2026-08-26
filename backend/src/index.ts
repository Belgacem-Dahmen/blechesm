import 'dotenv/config'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import crypto from 'crypto'
import prisma from './lib/prisma'
import { errorHandler } from './middleware/errorHandler'
import authAdminRouter from './routes/auth.admin'
import authClientRouter from './routes/auth.client'
import requestsPublicRouter from './routes/requests.public'
import requestsAdminRouter from './routes/requests.admin'
import requestsClientRouter from './routes/requests.client'
import portfolioRouter from './routes/portfolio'
import accountsRouter from './routes/accounts'
import generateRouter from './routes/generate'

const app = express()
const PORT = process.env.PORT ?? 3001

// Security headers
app.use(helmet())

// CORS — FRONTEND_URL accepte plusieurs origines séparées par des virgules
const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ?? 'https://blechesm.vercel.app').split(',').map(s => s.trim())
    : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))

// Parsing
app.use(express.json())
app.use(cookieParser())

// Structured request logger
app.use((req, res, next) => {
  const start = Date.now()
  const requestId = crypto.randomUUID()
  req.requestId = requestId
  res.on('finish', () => {
    console.log(
      JSON.stringify({
        requestId,
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs: Date.now() - start,
        ip: req.ip,
      })
    )
  })
  next()
})

// Health check
app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ data: { status: 'ok', db: 'ok', uptime: process.uptime(), version: '1.0.0' } })
  } catch {
    res.status(503).json({ data: { status: 'degraded', db: 'error' } })
  }
})

// Routes
app.use('/api/auth/admin', authAdminRouter)
app.use('/api/auth/client', authClientRouter)
app.use('/api/generate', generateRouter)
app.use('/api/requests', requestsPublicRouter) // POST public (soumission devis)
app.use('/api/requests', requestsAdminRouter)  // GET/PATCH admin (requireAdmin inside)
app.use('/api/client/requests', requestsClientRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/accounts', accountsRouter)

// Global error handler (must be last)
app.use(errorHandler)

const server = app.listen(PORT, () => {
  console.log(`[SERVER] http://localhost:${PORT} (${process.env.NODE_ENV ?? 'development'})`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[SHUTDOWN] Signal reçu...')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('[SHUTDOWN] OK')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10_000)
})

export default app
