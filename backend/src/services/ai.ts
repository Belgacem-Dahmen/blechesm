import { uploadImage } from './storage'

const GEMINI_MODEL = 'gemini-2.5-flash-image'
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const PLACEHOLDERS = [
  'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
  'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1200',
]

function buildMuralPlacementPrompt(description: string, serviceType: string): string {
  return `Use Image 1 as the exact base photograph and physical environment. Use Image 2 only as the visual reference for the mural artwork, composition, characters and graphic style.

Create a photorealistic mural mockup by applying the artwork from Image 2 directly onto the large textured wall visible in Image 1.

IMPORTANT: preserve the original architecture, geometry and camera perspective of Image 1 exactly. Do not change the camera position, focal length, wall dimensions, ceiling, floor, doors, windows, electrical outlets, cables, furniture or room proportions.

The mural must follow the real perspective and vanishing points of the wall in Image 1. Treat the wall as a real 3D surface and project/map the artwork onto that surface, rather than placing a flat rectangular image in front of the camera.

The artwork must naturally conform to the wall's perspective, including the wall's horizontal convergence and depth. The mural should visually extend across the entire usable wall surface from the foreground to the background.

Preserve the wall's existing physical texture and imperfections. The artwork should look like a professionally printed and installed large-format wall mural, with realistic adhesion to the wall surface, subtle texture interaction and natural lighting.

Do not copy the room, furniture, lighting or LED setup from Image 2. Image 2 is ONLY a reference for the artwork itself.

Keep the original viewpoint of Image 1 so that the result can be presented to a client as a realistic architectural visualization of the finished mural installation.

The final result must look like a real photograph of Image 1 after the mural has actually been installed, not an AI-generated room and not a pasted image.

No floating artwork, no rectangular poster effect, no artificial frame, no distortion of the room, no change of perspective, no additional furniture, no new objects.

The mural must be dimensionally believable and installation-ready.

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
