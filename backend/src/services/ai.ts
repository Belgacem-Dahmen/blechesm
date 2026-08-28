import { uploadImage } from './storage'

const GEMINI_MODEL = 'gemini-2.5-flash-image'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
  'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1200',
]

function buildMuralPlacementPrompt(description: string, serviceType: string): string {
  return `You are a professional architectural visualization specialist.

Your task is to realistically apply a provided artwork onto a real wall.

IMAGE 1: Real photograph of the wall.
IMAGE 2: Artwork that must be applied.

RULES:
1. Preserve the original photograph.
2. Preserve the wall geometry.
3. Preserve doors and windows.
4. Preserve furniture and objects.
5. Do not modify the camera perspective.
6. Do not redesign the artwork.
7. Preserve artwork composition and colors.
8. Adapt the artwork to the wall perspective.
9. Respect the wall boundaries.
10. Respect realistic lighting.
11. Integrate the artwork with the wall texture.
12. The result must look like a real photograph.

Do not generate a different mural.
Do not invent additional elements.
Do not alter the architecture.

The primary objective is realistic mural placement, not artistic reinterpretation.

Additional context: ${description}
Service type: ${serviceType}.`
}

function buildWallGenerationPrompt(description: string, serviceType: string): string {
  return `You are a professional street art visualization specialist.

Apply a realistic graffiti mural directly onto the wall in the photograph.

Style: ${serviceType}
Description: ${description}

RULES:
1. Preserve the original photograph and wall geometry.
2. Do not alter architecture, doors, windows, or furniture.
3. The mural must follow the wall perspective and lighting.
4. Integrate the artwork with the wall texture realistically.
5. The result must look like a real photograph of a painted wall.`
}

interface GeminiPart {
  text?: string
  inlineData?: { mimeType: string; data: string }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: GeminiPart[]
    }
  }>
  error?: { message: string }
}

async function callGemini(parts: GeminiPart[]): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY
  if (!apiKey) throw new Error('GOOGLE_AI_API_KEY manquant')

  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  }

  const res = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const json = (await res.json()) as GeminiResponse

  if (!res.ok || json.error) {
    throw new Error(`Gemini API error: ${json.error?.message ?? res.statusText}`)
  }

  const responseParts = json.candidates?.[0]?.content?.parts ?? []
  const imagePart = responseParts.find((p) => p.inlineData?.data)
  if (!imagePart?.inlineData?.data) throw new Error('Gemini n\'a pas retourné d\'image')

  return imagePart.inlineData.data
}

export async function generateImage(params: {
  wallPhotoBuffer?: Buffer
  refPhotoBuffer?: Buffer
  description: string
  serviceType: string
}): Promise<string> {
  if (process.env.NODE_ENV !== 'production') {
    await new Promise((r) => setTimeout(r, 2000))
    return PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]
  }

  let b64: string

  if (params.wallPhotoBuffer && params.refPhotoBuffer) {
    // Case 1: wall photo + artwork → realistic mural placement
    b64 = await callGemini([
      { text: buildMuralPlacementPrompt(params.description, params.serviceType) },
      { inlineData: { mimeType: 'image/jpeg', data: params.wallPhotoBuffer.toString('base64') } },
      { inlineData: { mimeType: 'image/jpeg', data: params.refPhotoBuffer.toString('base64') } },
    ])
  } else if (params.wallPhotoBuffer) {
    // Case 2: wall photo only → generate mural on the wall
    b64 = await callGemini([
      { text: buildWallGenerationPrompt(params.description, params.serviceType) },
      { inlineData: { mimeType: 'image/jpeg', data: params.wallPhotoBuffer.toString('base64') } },
    ])
  } else {
    // Case 3: no image → pure text-to-image
    const prompt = `Professional street art mural, ${params.serviceType} style. ${params.description}. Urban graffiti artwork, vibrant colors, photorealistic.`
    b64 = await callGemini([{ text: prompt }])
  }

  // Upload to Cloudinary for a permanent URL
  const buffer = Buffer.from(b64, 'base64')
  const url = await uploadImage(buffer, 'blechesm/generated')
  if (!url) throw new Error('Upload Cloudinary échoué')
  return url
}
