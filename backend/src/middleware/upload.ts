import multer from 'multer'
import { AppError } from '../lib/errors'

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024 // 10 MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      cb(new AppError('INVALID_FILE_TYPE', 400, 'Type de fichier non accepté (jpeg, png, webp uniquement)'))
      return
    }
    cb(null, true)
  },
})
