import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../lib/errors'

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.code,
      message: err.message,
      requestId: req.requestId,
      details: err.details ?? [],
    })
    return
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'Données invalides',
      requestId: req.requestId,
      details: err.errors,
    })
    return
  }

  console.error('[ERROR]', err)
  res.status(500).json({
    error: 'INTERNAL_ERROR',
    message: 'Erreur serveur interne',
    requestId: req.requestId,
    details: [],
  })
}
