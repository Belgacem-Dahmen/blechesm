import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { requireClient } from '../middleware/requireClient'
import { AppError } from '../lib/errors'
import { sendNewMessageToAdmin } from '../services/email'

const router = Router()
router.use(requireClient)

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const requests = await prisma.request.findMany({
      where: { clientId: req.client!.clientId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: requests })
  } catch (err) {
    next(err)
  }
})

router.get('/:id', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    // Scope strict : le client ne peut voir que ses propres demandes
    const request = await prisma.request.findFirst({
      where: { id: req.params.id, clientId: req.client!.clientId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    })
    if (!request) throw new AppError('NOT_FOUND', 404, 'Demande introuvable')
    res.json({ data: request })
  } catch (err) {
    next(err)
  }
})

const MessageSchema = z.object({ content: z.string().min(1) })

router.post('/:id/messages', async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = MessageSchema.safeParse(req.body)
    if (!parsed.success) { next(parsed.error); return }

    const request = await prisma.request.findFirst({
      where: { id: req.params.id, clientId: req.client!.clientId },
    })
    if (!request) throw new AppError('NOT_FOUND', 404, 'Demande introuvable')

    const message = await prisma.message.create({
      data: { requestId: request.id, fromRole: 'client', content: parsed.data.content },
    })

    sendNewMessageToAdmin({ requestId: request.id, clientName: req.client!.email })

    res.status(201).json({ data: message })
  } catch (err) {
    next(err)
  }
})

export default router
