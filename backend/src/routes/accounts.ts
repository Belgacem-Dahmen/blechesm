import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import prisma from '../lib/prisma'
import { requireAdmin } from '../middleware/requireAdmin'
import { AppError } from '../lib/errors'
import { validate } from '../middleware/validate'

const router = Router()
router.use(requireAdmin)

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await prisma.admin.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ data: accounts })
  } catch (err) {
    next(err)
  }
})

const CreateAccountSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  role: z.string().default('Admin'),
})

router.post('/', validate(CreateAccountSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body as z.infer<typeof CreateAccountSchema>

    const existing = await prisma.admin.findUnique({ where: { email } })
    if (existing) throw new AppError('INVALID_INPUT', 400, 'Un compte avec cet email existe déjà')

    const hashed = await bcrypt.hash(password, 12)
    const admin = await prisma.admin.create({
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    res.status(201).json({ data: admin })
  } catch (err) {
    next(err)
  }
})

export default router
