import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'
import { AppError } from '../lib/errors'
import { sendStatusUpdate, sendQuoteReady, sendNewMessageToClient } from '../services/email'

const router = Router()
router.use(requireAdmin)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = typeof req.query['status'] === 'string' ? req.query['status'] : undefined
    const requests = await prisma.request.findMany({
      where: status ? { status } : undefined,
      include: {
        client: { select: { name: true, email: true, phone: true, city: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.set('Cache-Control', 'no-store')
    res.json({ data: requests })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: {
        client: { select: { id: true, name: true, email: true, phone: true, city: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!request) throw new AppError('NOT_FOUND', 404, 'Demande introuvable')
    res.json({ data: request })
  } catch (err) {
    next(err)
  }
})

const PatchSchema = z.object({
  status: z.enum(['nouveau', 'en_cours', 'traite', 'annule']).optional(),
  finalPrice: z.number().positive().optional(),
  internalNotes: z.string().optional(),
})

router.patch('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = PatchSchema.safeParse(req.body)
    if (!parsed.success) { next(parsed.error); return }

    const existing = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: { client: { select: { id: true, name: true, email: true } } },
    })
    if (!existing) throw new AppError('NOT_FOUND', 404, 'Demande introuvable')

    const updated = await prisma.request.update({
      where: { id: req.params.id },
      data: parsed.data,
      include: {
        client: { select: { id: true, name: true, email: true, phone: true, city: true } },
        messages: { orderBy: { createdAt: 'asc' } },
      },
    })

    if (parsed.data.status && parsed.data.status !== existing.status) {
      sendStatusUpdate({
        to: existing.client.email,
        clientName: existing.client.name,
        status: parsed.data.status,
        requestId: existing.id,
      })
    }
    if (parsed.data.finalPrice !== undefined && !existing.finalPrice) {
      sendQuoteReady({
        to: existing.client.email,
        clientName: existing.client.name,
        price: parsed.data.finalPrice,
        requestId: existing.id,
      })
    }

    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

const MessageSchema = z.object({ content: z.string().min(1) })

router.post('/:id/messages', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = MessageSchema.safeParse(req.body)
    if (!parsed.success) { next(parsed.error); return }

    const request = await prisma.request.findUnique({
      where: { id: req.params.id },
      include: { client: true },
    })
    if (!request) throw new AppError('NOT_FOUND', 404, 'Demande introuvable')

    const message = await prisma.message.create({
      data: { requestId: req.params.id, fromRole: 'admin', content: parsed.data.content },
    })

    const magicToken = crypto.randomBytes(32).toString('hex')
    await prisma.client.update({
      where: { id: request.client.id },
      data: { magicToken, magicExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
    })
    sendNewMessageToClient({
      to: request.client.email,
      clientName: request.client.name,
      requestId: request.id,
      magicToken,
    })

    res.status(201).json({ data: message })
  } catch (err) {
    next(err)
  }
})

export default router
