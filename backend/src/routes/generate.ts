import { Router, Request, Response, NextFunction } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import { upload } from '../middleware/upload'
import { uploadImage } from '../services/storage'
import { enqueueJob, getJob } from '../lib/jobQueue'
import { AppError } from '../lib/errors'

const router = Router()

const GenerateSchema = z.object({
  description: z.string().min(5, 'Description trop courte'),
  serviceType: z.enum(['mural', 'sculpture', 'sol']),
})

router.post(
  '/',
  upload.fields([
    { name: 'wallPhoto', maxCount: 1 },
    { name: 'refPhoto', maxCount: 1 },
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = GenerateSchema.safeParse(req.body)
      if (!parsed.success) { next(parsed.error); return }

      const files = req.files as Record<string, Express.Multer.File[]> | undefined

      const wallPhotoUrl = files?.wallPhoto?.[0]
        ? await uploadImage(files.wallPhoto[0].buffer, 'blechesm/walls')
        : undefined
      const refPhotoUrl = files?.refPhoto?.[0]
        ? await uploadImage(files.refPhoto[0].buffer, 'blechesm/refs')
        : undefined

      const jobId = crypto.randomUUID()
      enqueueJob({ jobId, wallPhotoUrl, refPhotoUrl, ...parsed.data })

      res.status(202).json({ data: { jobId, status: 'pending' } })
    } catch (err) {
      next(err)
    }
  }
)

router.get('/:jobId', (req: Request<{ jobId: string }>, res: Response, next: NextFunction) => {
  try {
    const job = getJob(req.params.jobId)
    if (!job) throw new AppError('NOT_FOUND', 404, 'Job introuvable')
    res.json({ data: { status: job.status, url: job.url ?? null, error: job.error ?? null } })
  } catch (err) {
    next(err)
  }
})

export default router
