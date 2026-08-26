import { Router, Request, Response, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import rateLimit from 'express-rate-limit'
import prisma from '../lib/prisma'
import { AppError } from '../lib/errors'
import { validate } from '../middleware/validate'
import { requireAdmin } from '../middleware/requireAdmin'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'TOO_MANY_REQUESTS', message: 'Trop de tentatives, réessayez dans une minute' },
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

router.post('/login', loginLimiter, validate(LoginSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as z.infer<typeof LoginSchema>
    const admin = await prisma.admin.findUnique({ where: { email } })
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      throw new AppError('UNAUTHORIZED', 401, 'Email ou mot de passe incorrect')
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email },
      process.env.JWT_ADMIN_SECRET!,
      { expiresIn: '7d' }
    )

    res.cookie('adminToken', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.json({ data: { id: admin.id, name: admin.name, email: admin.email, role: admin.role } })
  } catch (err) {
    next(err)
  }
})

router.post('/logout', (_req: Request, res: Response) => {
  res.clearCookie('adminToken')
  res.json({ data: { success: true } })
})

router.get('/me', requireAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: req.admin!.adminId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    if (!admin) throw new AppError('NOT_FOUND', 404, 'Compte introuvable')
    res.json({ data: admin })
  } catch (err) {
    next(err)
  }
})

export default router
