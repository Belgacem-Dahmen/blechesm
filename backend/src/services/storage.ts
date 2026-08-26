import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  timeout: 15000,
})

export async function uploadImage(buffer: Buffer, folder: string): Promise<string | undefined> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn('[STORAGE] Cloudinary non configuré — upload ignoré')
    return undefined
  }
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload échoué'))
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}
