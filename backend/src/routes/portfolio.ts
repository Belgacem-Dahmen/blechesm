import { Router, Request, Response, NextFunction } from 'express'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'
import { AppError } from '../lib/errors'
import { upload } from '../middleware/upload'
import { uploadImage } from '../services/storage'

const router = Router()

const PortfolioSchema = z.object({
  title: z.string().min(1),
  style: z.string().min(1),
  city: z.string().min(1),
  year: z.coerce.number().int().min(2000).max(2030),
  size: z.string().min(1),
  tags: z.string(), // JSON array stringifié
  description: z.string().min(1),
  imageUrl: z.string().url().optional(),
})

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const items = await prisma.portfolio.findMany({ orderBy: { createdAt: 'desc' } })
    res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
    res.json({ data: items })
  } catch (err) {
    next(err)
  }
})

router.post('/', requireAdmin, upload.single('image'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = PortfolioSchema.safeParse(req.body)
    if (!parsed.success) { next(parsed.error); return }

    let imageUrl = parsed.data.imageUrl
    if (req.file) {
      imageUrl = await uploadImage(req.file.buffer, 'blechesm/portfolio')
    }
    if (!imageUrl) throw new AppError('INVALID_INPUT', 400, 'Image requise')

    const item = await prisma.portfolio.create({
      data: { ...parsed.data, imageUrl, year: Number(parsed.data.year) },
    })
    res.status(201).json({ data: item })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', requireAdmin, upload.single('image'), async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const parsed = PortfolioSchema.partial().safeParse(req.body)
    if (!parsed.success) { next(parsed.error); return }

    const existing = await prisma.portfolio.findUnique({ where: { id: req.params.id } })
    if (!existing) throw new AppError('NOT_FOUND', 404, 'Item introuvable')

    let imageUrl = parsed.data.imageUrl ?? existing.imageUrl
    if (req.file) {
      imageUrl = (await uploadImage(req.file.buffer, 'blechesm/portfolio')) ?? imageUrl
    }

    const updated = await prisma.portfolio.update({
      where: { id: req.params.id },
      data: {
        ...parsed.data,
        imageUrl,
        year: parsed.data.year !== undefined ? Number(parsed.data.year) : existing.year,
      },
    })
    res.json({ data: updated })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', requireAdmin, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const existing = await prisma.portfolio.findUnique({ where: { id: req.params.id } })
    if (!existing) throw new AppError('NOT_FOUND', 404, 'Item introuvable')
    await prisma.portfolio.delete({ where: { id: req.params.id } })
    res.json({ data: { success: true } })
  } catch (err) {
    next(err)
  }
})

export default router
