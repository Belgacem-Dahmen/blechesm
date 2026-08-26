import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { upload } from '../middleware/upload'
import { uploadImage } from '../services/storage'
import { sendRequestConfirmation, sendAdminNotification } from '../services/email'

const router = Router()

const SubmitSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  email: z.string().email('Email invalide'),
  phone: z.string().optional(),
  city: z.string().optional(),
  serviceType: z.enum(['mural', 'sculpture', 'sol']),
  description: z.string().min(10, 'Description trop courte'),
  width: z.coerce.number().positive().optional(),
  height: z.coerce.number().positive().optional(),
  materialStyle: z.string().optional(),
  surfaceFinish: z.string().optional(),
  generatedImage: z.string().optional(), // URL de l'image générée par l'IA
})

router.post(
  '/',
  upload.fields([
    { name: 'wallPhoto', maxCount: 1 },
    { name: 'refPhoto', maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = SubmitSchema.safeParse(req.body)
      if (!parsed.success) {
        next(parsed.error)
        return
      }
      const data = parsed.data

      // Idempotence — évite les soumissions en double sur 5 minutes
      const idempotencyKey = crypto
        .createHash('sha256')
        .update(`${data.email}:${data.description}:${data.serviceType}`)
        .digest('hex')

      const existing = await prisma.request.findFirst({
        where: { idempotencyKey, createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } },
      })
      if (existing) {
        res.json({ data: { id: existing.id, success: true } })
        return
      }

      // Upsert client
      let client = await prisma.client.findUnique({ where: { email: data.email } })
      if (!client) {
        client = await prisma.client.create({
          data: { name: data.name, email: data.email, phone: data.phone, city: data.city },
        })
      }

      // Upload photos (fire-and-forget si Cloudinary non configuré)
      const files = req.files as Record<string, Express.Multer.File[]> | undefined
      const wallPhotoUrl = files?.wallPhoto?.[0]
        ? await uploadImage(files.wallPhoto[0].buffer, 'blechesm/walls')
        : undefined
      const referencePhotoUrl = files?.refPhoto?.[0]
        ? await uploadImage(files.refPhoto[0].buffer, 'blechesm/refs')
        : undefined

      const request = await prisma.request.create({
        data: {
          clientId: client.id,
          serviceType: data.serviceType,
          description: data.description,
          wallWidth: data.width,
          wallHeight: data.height,
          materialStyle: data.materialStyle,
          surfaceFinish: data.surfaceFinish,
          wallPhotoUrl,
          referencePhotoUrl,
          generatedImageUrl: data.generatedImage,
          idempotencyKey,
        },
      })

      // Magic link pour l'email de confirmation
      const magicToken = crypto.randomBytes(32).toString('hex')
      await prisma.client.update({
        where: { id: client.id },
        data: { magicToken, magicExpiresAt: new Date(Date.now() + 15 * 60 * 1000) },
      })

      sendRequestConfirmation({ to: client.email, clientName: client.name, requestId: request.id, magicToken })
      sendAdminNotification({ requestId: request.id, clientName: client.name })

      res.status(201).json({ data: { id: request.id, success: true } })
    } catch (err) {
      next(err)
    }
  }
)

export default router
