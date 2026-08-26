import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import prisma from '../lib/prisma'
import { AppError } from '../lib/errors'
import { validate } from '../middleware/validate'
import { requireClient } from '../middleware/requireClient'
import { sendMagicLink } from '../services/email'

const router = Router()

const magicLinkLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Trop de tentatives, réessayez dans une minute' },
})

const MagicLinkSchema = z.object({
  email: z.string().email(),
})

router.post('/magic-link', magicLinkLimiter, validate(MagicLinkSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body as z.infer<typeof MagicLinkSchema>
    const client = await prisma.client.findUnique({ where: { email } })
    if (!client) {
      // Ne pas révéler si l'email existe ou non
      res.json({ data: { success: true } })
      return
    }

    const token = crypto.randomBytes(32).toString('hex')
    await prisma.client.update({
      where: { id: client.id },
      data: { magicToken: token, magicExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    })

    sendMagicLink({ to: client.email, clientName: client.name, token })
    res.json({ data: { success: true } })
  } catch (err) {
    next(err)
  }
})

router.get('/verify', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.query as { token?: string }
    if (!token) throw new AppError('UNAUTHORIZED', 401, 'Token manquant')

    const client = await prisma.client.findFirst({
      where: { magicToken: token, magicExpiresAt: { gt: new Date() } },
    })
    if (!client) throw new AppError('MAGIC_LINK_EXPIRED', 401, 'Lien expiré ou déjà utilisé')

    await prisma.client.update({
      where: { id: client.id },
      data: { magicToken: null, magicExpiresAt: null },
    })

    const jwtToken = jwt.sign(
      { clientId: client.id, email: client.email },
      process.env.JWT_CLIENT_SECRET!,
      { expiresIn: '24h' }
    )

    res.cookie('clientToken', jwtToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    })

    res.redirect(`${process.env.FRONTEND_URL ?? 'http://localhost:5173'}/mon-espace`)
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('clientToken')
  res.json({ data: { success: true } })
})

router.get('/me', requireClient, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await prisma.client.findUnique({
      where: { id: req.client!.clientId },
      select: { id: true, name: true, email: true, phone: true, city: true, createdAt: true },
    })
    if (!client) throw new AppError('NOT_FOUND', 404, 'Compte introuvable')
    res.json({ data: client })
  } catch (err) {
    next(err)
  }
})

export default router
