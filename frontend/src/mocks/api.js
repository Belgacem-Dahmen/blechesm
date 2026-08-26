// API client — appels réels vers le backend via axios
// Configurer VITE_API_URL dans frontend/.env (défaut : http://localhost:3001)

import api from '@/lib/axios.js'

// ─── Transformers — backend shape → shape attendue par les vues ─────────────

function toRequest(r) {
  return {
    id:             r.id,
    createdAt:      r.createdAt,
    status:         r.status,
    serviceType:    r.serviceType,
    client:         r.client ?? { name: '', email: '', phone: '', city: '' },
    wall: {
      width:        r.wallWidth  ?? null,
      height:       r.wallHeight ?? null,
      description:  r.description,
    },
    wallPhoto:      r.wallPhotoUrl      ?? null,
    referencePhoto: r.referencePhotoUrl ?? null,
    generatedImage: r.generatedImageUrl ?? null,
    finalPrice:     r.finalPrice,
    internalNotes:  r.internalNotes,
    messages:       r.messages ?? [],
  }
}

function toPortfolio(p) {
  return {
    ...p,
    image: p.imageUrl,
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags ?? []),
  }
}

// ─── Helper — blob URL → File ───────────────────────────────────────────────

async function blobUrlToFile(url, filename) {
  if (!url || typeof url !== 'string') return null
  if (!url.startsWith('blob:') && !url.startsWith('data:')) return null
  try {
    const res  = await fetch(url)
    const blob = await res.blob()
    return new File([blob], filename, { type: blob.type })
  } catch {
    return null
  }
}

// ─── AI Génération (async avec polling) ────────────────────────────────────

export async function generateFresco(wallPhoto, refPhoto, description, serviceType = 'mural') {
  const fd = new FormData()
  fd.append('description', description ?? '')
  fd.append('serviceType', serviceType)
  if (wallPhoto instanceof File) fd.append('wallPhoto', wallPhoto)
  if (refPhoto  instanceof File) fd.append('refPhoto',  refPhoto)

  const { jobId } = await api.post('/api/generate', fd)

  // Polling toutes les 2s jusqu'à status "done" (max 2 minutes)
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 2000))
    const job = await api.get(`/api/generate/${jobId}`)
    if (job.status === 'done')  return job.url
    if (job.status === 'error') throw new Error(job.error ?? 'Génération échouée')
  }
  throw new Error('Timeout — la génération a pris trop de temps')
}

// ─── Demandes ───────────────────────────────────────────────────────────────

export async function getRequests() {
  const requests = await api.get('/api/requests')
  return requests.map(toRequest)
}

export async function getRequest(id) {
  return toRequest(await api.get(`/api/requests/${id}`))
}

export async function updateRequest(id, patch) {
  return toRequest(await api.patch(`/api/requests/${id}`, patch))
}

export async function submitQuote(data) {
  const fd = new FormData()

  fd.append('name',        data.name        ?? '')
  fd.append('email',       data.email       ?? '')
  fd.append('phone',       data.phone       ?? '')
  fd.append('city',        data.city        ?? '')
  fd.append('serviceType', data.serviceType ?? 'mural')
  fd.append('description', data.description ?? '')
  if (data.width)  fd.append('width',  String(data.width))
  if (data.height) fd.append('height', String(data.height))
  if (data.generatedImage && typeof data.generatedImage === 'string') {
    fd.append('generatedImage', data.generatedImage)
  }

  const wallFile = data.wallPhoto instanceof File
    ? data.wallPhoto
    : await blobUrlToFile(data.wallPhoto, 'wall.jpg')
  const refFile = data.referencePhoto instanceof File
    ? data.referencePhoto
    : await blobUrlToFile(data.referencePhoto, 'ref.jpg')

  if (wallFile) fd.append('wallPhoto', wallFile)
  if (refFile)  fd.append('refPhoto',  refFile)

  return api.post('/api/requests', fd)
}

// ─── Portfolio ──────────────────────────────────────────────────────────────

export async function getPortfolio() {
  const items = await api.get('/api/portfolio')
  return items.map(toPortfolio)
}

export async function createPortfolio(item) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(item)) {
    if (k === 'image' && v instanceof File) {
      fd.append('image', v)
    } else if (k !== 'image' && v !== undefined && v !== null) {
      fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
    }
  }
  return toPortfolio(await api.post('/api/portfolio', fd))
}

export async function updatePortfolio(id, item) {
  const fd = new FormData()
  for (const [k, v] of Object.entries(item)) {
    if (k === 'image' && v instanceof File) {
      fd.append('image', v)
    } else if (k !== 'image' && v !== undefined && v !== null) {
      fd.append(k, Array.isArray(v) ? JSON.stringify(v) : String(v))
    }
  }
  return toPortfolio(await api.put(`/api/portfolio/${id}`, fd))
}

export async function deletePortfolio(id) {
  return api.delete(`/api/portfolio/${id}`)
}

// ─── Comptes Admin ──────────────────────────────────────────────────────────

export async function getAdminAccounts() {
  return api.get('/api/accounts')
}

export async function createAdminAccount(data) {
  return api.post('/api/accounts', data)
}

export async function deleteAdminAccount(id) {
  return api.delete(`/api/accounts/${id}`)
}
