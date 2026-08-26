import Replicate from 'replicate'

const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN ?? '' })

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
  'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1200',
]

async function callReplicateWithRetry(
  input: Record<string, unknown>,
  maxRetries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const output = (await replicate.run('stability-ai/stable-diffusion', {
        input,
      })) as string[]
      return output[0]
    } catch (err) {
      if (attempt === maxRetries) throw err
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 500, 10000)
      await new Promise((r) => setTimeout(r, delay))
    }
  }
  throw new Error('Max retries exceeded')
}

export async function generateImage(params: {
  wallPhotoUrl?: string
  refPhotoUrl?: string
  description: string
  serviceType: string
}): Promise<string> {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise((r) => setTimeout(r, 2000))
    return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  }

  return callReplicateWithRetry({
    image: params.wallPhotoUrl ?? params.refPhotoUrl,
    prompt: `Street art mural, ${params.serviceType}, ${params.description}, professional graffiti artwork`,
    strength: 0.7,
  })
}
