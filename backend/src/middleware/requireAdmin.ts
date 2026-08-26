import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from '../lib/errors'

export function requireAdmin(req: Request, _res: Response, next: NextFunction): void {
  const token = req.cookies?.adminToken as string | undefined
  if (!token) {
    next(new AppError('UNAUTHORIZED', 401, 'Authentification requise'))
    return
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_ADMIN_SECRET!) as {
      adminId: string
      email: string
    }
    req.admin = payload
    next()
  } catch {
    next(new AppError('UNAUTHORIZED', 401, 'Token invalide ou expiré'))
  }
}
