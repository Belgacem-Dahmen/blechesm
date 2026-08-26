import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM ?? 'onboarding@resend.dev'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? ''
const FRONTEND_URL = process.env.FRONTEND_URL ?? 'http://localhost:5173'

let _resend: Resend | null = null
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

type SendParams = Parameters<Resend['emails']['send']>[0]

async function sendSafe(params: SendParams): Promise<void> {
  const client = getResend()
  if (!client) {
    console.warn('[EMAIL] RESEND_API_KEY non configuré — email ignoré:', params.to)
    return
  }
  try {
    await client.emails.send(params)
  } catch (err) {
    console.error('[EMAIL_FAIL]', (err as Error).message, params.to)
  }
}

export function sendRequestConfirmation(opts: {
  to: string
  clientName: string
  requestId: string
  magicToken: string
}): void {
  const url = `${FRONTEND_URL}/mon-espace?token=${opts.magicToken}`
  sendSafe({
    from: FROM,
    to: opts.to,
    subject: 'Votre demande Blechesm a bien été reçue',
    html: `<h2>Bonjour ${opts.clientName},</h2>
           <p>Votre demande a bien été enregistrée. Notre équipe vous recontactera sous 48h.</p>
           <p><a href="${url}">Accéder à mon espace →</a></p>`,
  })
}

export function sendAdminNotification(opts: {
  requestId: string
  clientName: string
}): void {
  if (!ADMIN_EMAIL) return
  sendSafe({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Nouvelle demande de ${opts.clientName}`,
    html: `<p>Nouvelle demande soumise par <strong>${opts.clientName}</strong>.</p>
           <p><a href="${FRONTEND_URL}/admin/demandes/${opts.requestId}">Voir la demande →</a></p>`,
  })
}

export function sendMagicLink(opts: {
  to: string
  clientName: string
  token: string
}): void {
  const url = `${FRONTEND_URL}/mon-espace?token=${opts.token}`
  sendSafe({
    from: FROM,
    to: opts.to,
    subject: 'Accéder à mon espace Blechesm',
    html: `<h2>Bonjour ${opts.clientName},</h2>
           <p><a href="${url}">Cliquez ici pour accéder à votre espace</a> (lien valable 15 minutes)</p>`,
  })
}

export function sendStatusUpdate(opts: {
  to: string
  clientName: string
  status: string
  requestId: string
}): void {
  const labels: Record<string, string> = {
    en_cours: 'en cours de traitement',
    traite: 'traité',
    annule: 'annulé',
  }
  sendSafe({
    from: FROM,
    to: opts.to,
    subject: 'Mise à jour de votre demande Blechesm',
    html: `<p>Bonjour ${opts.clientName}, votre demande est maintenant <strong>${labels[opts.status] ?? opts.status}</strong>.</p>
           <p><a href="${FRONTEND_URL}/mon-espace/${opts.requestId}">Voir ma demande →</a></p>`,
  })
}

export function sendQuoteReady(opts: {
  to: string
  clientName: string
  price: number
  requestId: string
}): void {
  sendSafe({
    from: FROM,
    to: opts.to,
    subject: 'Votre devis Blechesm est prêt',
    html: `<p>Bonjour ${opts.clientName}, votre devis est prêt : <strong>${opts.price} DT</strong></p>
           <p><a href="${FRONTEND_URL}/mon-espace/${opts.requestId}">Voir mon devis →</a></p>`,
  })
}

export function sendNewMessageToClient(opts: {
  to: string
  clientName: string
  requestId: string
  magicToken: string
}): void {
  const url = `${FRONTEND_URL}/mon-espace?token=${opts.magicToken}`
  sendSafe({
    from: FROM,
    to: opts.to,
    subject: "Nouveau message de l'équipe Blechesm",
    html: `<p>Bonjour ${opts.clientName}, l'équipe Blechesm vous a envoyé un message.</p>
           <p><a href="${url}">Lire le message →</a></p>`,
  })
}

export function sendNewMessageToAdmin(opts: {
  requestId: string
  clientName: string
}): void {
  if (!ADMIN_EMAIL) return
  sendSafe({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Message de ${opts.clientName}`,
    html: `<p>${opts.clientName} vous a envoyé un message.</p>
           <p><a href="${FRONTEND_URL}/admin/demandes/${opts.requestId}">Voir le message →</a></p>`,
  })
}
