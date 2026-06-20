// Mock API — replace each function with a real fetch() call later without touching components

import { requestsData, portfolioData, adminsData } from './data.js'

// Deep clone helper to avoid mutating seed data
const clone = (obj) => JSON.parse(JSON.stringify(obj))

// In-memory state (resets on page refresh — intentional for demo)
let _requests = clone(requestsData)
let _portfolio = clone(portfolioData)
let _admins = clone(adminsData)

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

// ─── AI Generation ───────────────────────────────────────────────────────────

/**
 * Simulate Nano Banana API — returns a placeholder "generated" image URL
 */
export async function generateFresco(wallPhoto, refPhoto, description) {
  await delay(2500)
  // Return a visually interesting graffiti/mural placeholder
  const placeholders = [
    'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200&q=85',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=85',
    'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1200&q=85',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=1200&q=85',
  ]
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}

// ─── Requests ─────────────────────────────────────────────────────────────────

export async function getRequests() {
  await delay(400)
  return clone(_requests).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export async function getRequest(id) {
  await delay(250)
  const item = _requests.find((r) => r.id === id)
  if (!item) throw new Error(`Request ${id} not found`)
  return clone(item)
}

export async function updateRequest(id, patch) {
  await delay(350)
  const idx = _requests.findIndex((r) => r.id === id)
  if (idx === -1) throw new Error(`Request ${id} not found`)
  _requests[idx] = { ..._requests[idx], ...patch }
  return clone(_requests[idx])
}

export async function submitQuote(data) {
  await delay(600)
  const newRequest = {
    id: String(Date.now()),
    createdAt: new Date().toISOString(),
    status: 'nouveau',
    client: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
    },
    wall: {
      width: data.width,
      height: data.height,
      description: data.description,
    },
    wallPhoto: data.wallPhoto,
    referencePhoto: data.referencePhoto || null,
    generatedImage: data.generatedImage,
    finalPrice: null,
    internalNotes: '',
  }
  _requests.unshift(newRequest)
  return { success: true, id: newRequest.id }
}

// ─── Portfolio ────────────────────────────────────────────────────────────────

export async function getPortfolio() {
  await delay(400)
  return clone(_portfolio)
}

export async function createPortfolio(item) {
  await delay(400)
  const newItem = { ...item, id: String(Date.now()) }
  _portfolio.unshift(newItem)
  return clone(newItem)
}

export async function updatePortfolio(id, item) {
  await delay(350)
  const idx = _portfolio.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error(`Portfolio item ${id} not found`)
  _portfolio[idx] = { ..._portfolio[idx], ...item, id }
  return clone(_portfolio[idx])
}

export async function deletePortfolio(id) {
  await delay(300)
  const idx = _portfolio.findIndex((p) => p.id === id)
  if (idx === -1) throw new Error(`Portfolio item ${id} not found`)
  _portfolio.splice(idx, 1)
  return { success: true }
}

// ─── Admin Accounts ───────────────────────────────────────────────────────────

export async function getAdminAccounts() {
  await delay(300)
  return clone(_admins)
}

export async function createAdminAccount(data) {
  await delay(400)
  const newAdmin = {
    id: String(Date.now()),
    name: data.name,
    email: data.email,
    createdAt: new Date().toISOString(),
    role: 'Admin',
  }
  _admins.push(newAdmin)
  return clone(newAdmin)
}
