# Backend Blechesm — Plan d'implémentation

## Vue d'ensemble

Le front-end est un SPA Vue 3 qui consomme aujourd'hui une couche mock (`src/mocks/api.js`).
L'objectif est de remplacer chaque fonction mock par un vrai appel `fetch()` **sans toucher aux composants**.
Le seul fichier front à modifier sera `src/mocks/api.js`.

Il y a **deux espaces distincts** avec leurs propres auth et vues :

| Espace | Accès | Description |
|---|---|---|
| **Espace Client** | `/mon-espace` | Le client suit ses demandes après soumission — statut, devis, messages |
| **Espace Admin** | `/admin` | L'équipe Blechesm gère toutes les demandes, le portfolio, les comptes |

---

## Stack technique

| Couche | Choix | Raison |
|---|---|---|
| Runtime | **Node.js 20 LTS** | Stable, compatible Vercel/Railway |
| Framework | **Express 5** | Simple, grande communauté, adapté à ce scope |
| ORM | **Prisma** | Migrations auto, typage TS, compatible PostgreSQL & SQLite |
| Base de données | **PostgreSQL** (prod) / SQLite (dev) | PostgreSQL sur Railway/Supabase, SQLite pour démarrer sans infra |
| Auth | **JWT** (httpOnly cookie) | Stateless, deux tokens séparés (client / admin) |
| Upload fichiers | **Multer** + **Cloudinary** | Upload multi-part → stockage cloud avec URL stable |
| IA génération | **Replicate API** (Stable Diffusion) | Pay-as-you-go, pas d'infra GPU à gérer |
| Email | **Resend** | Notifications + liens magiques client |
| Validation | **Zod** | Schémas partagés req/res, messages d'erreur clairs |

---

## Structure du projet

```
backend/
├── src/
│   ├── index.js               # Point d'entrée Express
│   ├── routes/
│   │   ├── auth.admin.js      # POST /api/auth/admin/login, /logout, /me
│   │   ├── auth.client.js     # POST /api/auth/client/magic-link, /verify
│   │   ├── generate.js        # POST /api/generate
│   │   ├── requests.js        # CRUD demandes (admin) + lecture client
│   │   ├── portfolio.js       # CRUD portfolio
│   │   └── accounts.js        # CRUD comptes admin
│   ├── middleware/
│   │   ├── requireAdmin.js    # Vérifie JWT admin
│   │   ├── requireClient.js   # Vérifie JWT client
│   │   ├── upload.js          # Multer config
│   │   └── validate.js        # Zod middleware
│   ├── services/
│   │   ├── ai.js              # Appel Replicate API
│   │   ├── storage.js         # Upload Cloudinary
│   │   └── email.js           # Resend — confirmations + magic links
│   └── lib/
│       └── prisma.js          # Instance Prisma singleton
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env.example
├── package.json
└── vercel.json
```

---

## Modèles de données (Prisma)

```prisma
// Compte admin (équipe Blechesm)
model Admin {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String   // bcrypt hash
  role      String   @default("Admin")
  createdAt DateTime @default(now())
}

// Compte client — créé automatiquement à la 1ère soumission
model Client {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  phone     String?
  city      String?
  createdAt DateTime  @default(now())
  requests  Request[]

  // Magic link auth (pas de mot de passe)
  magicToken     String?   // token temporaire envoyé par email
  magicExpiresAt DateTime? // expiration du token (15 min)
}

// Demande de projet
model Request {
  id          String   @id @default(cuid())
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  status      String   @default("nouveau") // nouveau | en_cours | traite | annule
  serviceType String                        // mural | sculpture | sol

  // Relation client
  clientId    String
  client      Client   @relation(fields: [clientId], references: [id])

  // Projet
  wallWidth      Float?
  wallHeight     Float?
  description    String
  materialStyle  String?  // sculpture: clay | marble | metal | concrete | neon
  surfaceFinish  String?  // sol: mat | brillant | metallique

  // Photos (URLs Cloudinary)
  wallPhotoUrl      String?
  referencePhotoUrl String?
  generatedImageUrl String?

  // Admin
  finalPrice    Float?
  internalNotes String   @default("")

  // Messages de suivi (échanges admin ↔ client)
  messages      Message[]
}

// Messages de suivi sur une demande
model Message {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  requestId String
  request   Request  @relation(fields: [requestId], references: [id])
  fromRole  String   // "admin" | "client"
  content   String
}

model Portfolio {
  id          String   @id @default(cuid())
  title       String
  style       String
  city        String
  year        Int
  size        String
  imageUrl    String
  tags        String   // JSON array stringifié
  description String
  createdAt   DateTime @default(now())
}
```

---

## Deux systèmes d'authentification

### Auth Admin (email + mot de passe)

```
POST /api/auth/admin/login   → vérifie email/password → JWT admin (httpOnly cookie, 7j)
POST /api/auth/admin/logout  → clear cookie
GET  /api/auth/admin/me      → retourne l'admin connecté
```

### Auth Client (magic link — sans mot de passe)

Le client n'a pas de mot de passe. Après avoir soumis un devis, il reçoit un email avec un **lien magique** pour accéder à son espace.

```
POST /api/auth/client/magic-link   body: { email }
  → génère un token (32 bytes random), l'enregistre en base (expiration 15 min)
  → envoie l'email : "Accéder à mes demandes → https://blechesm.fr/mon-espace?token=xxx"

GET  /api/auth/client/verify?token=xxx
  → valide le token → génère JWT client (httpOnly cookie, 24h)
  → redirige vers /mon-espace

POST /api/auth/client/logout → clear cookie
GET  /api/auth/client/me     → retourne le client connecté
```

---

## API Endpoints complets

### IA Génération (public)

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/generate` | Public | Upload photos → Replicate → URL image générée |

**Body (multipart/form-data) :**
```
wallPhoto      File (optionnel)
refPhoto       File (optionnel)
description    string
serviceType    mural | sculpture | sol
```

---

### Demandes — Espace Client

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `POST` | `/api/requests` | Public | Soumettre une demande (crée le client si nouveau) |
| `GET` | `/api/client/requests` | Client | Liste ses propres demandes |
| `GET` | `/api/client/requests/:id` | Client | Détail d'une de ses demandes |
| `POST` | `/api/client/requests/:id/messages` | Client | Envoyer un message sur une demande |

**Flow POST /api/requests :**
1. Vérifie si un `Client` existe avec cet email, sinon le crée
2. Upload photos sur Cloudinary
3. Crée la `Request` en base
4. Envoie email de confirmation au client avec lien magic link pour accéder à son espace
5. Envoie email de notification à l'admin

---

### Demandes — Espace Admin

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/requests` | Admin | Liste toutes les demandes (avec filtres status) |
| `GET` | `/api/requests/:id` | Admin | Détail complet d'une demande |
| `PATCH` | `/api/requests/:id` | Admin | Modifier status / finalPrice / internalNotes |
| `POST` | `/api/requests/:id/messages` | Admin | Envoyer un message au client |

---

### Portfolio (public en lecture, admin en écriture)

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/portfolio` | Public | Liste tous les items |
| `POST` | `/api/portfolio` | Admin | Créer un item |
| `PUT` | `/api/portfolio/:id` | Admin | Modifier un item |
| `DELETE` | `/api/portfolio/:id` | Admin | Supprimer un item |

---

### Comptes Admin

| Méthode | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/api/accounts` | Admin | Liste les comptes admin |
| `POST` | `/api/accounts` | Admin | Créer un compte admin |

---

## Espace Client — vues front à créer

Ces routes front sont à ajouter dans le router Vue :

| Route Vue | Vue | Description |
|---|---|---|
| `/mon-espace` | `ClientDashboardView.vue` | Liste des demandes du client |
| `/mon-espace/:id` | `ClientRequestView.vue` | Détail d'une demande — statut, devis, messages |
| `/mon-espace/connexion` | `ClientLoginView.vue` | Formulaire email → déclenche magic link |

**ClientDashboardView** affiche :
- Statut de chaque demande (badge : Nouveau / En cours / Traité)
- Prix final si défini
- Accès au thread de messages

**ClientRequestView** affiche :
- Toutes les infos du projet
- L'image générée par IA
- Le fil de messages avec l'équipe Blechesm
- Le devis final (si `finalPrice` est défini)

---

## Emails envoyés

| Déclencheur | Destinataire | Contenu |
|---|---|---|
| Nouvelle demande soumise | Client | Confirmation + magic link pour accéder à l'espace client |
| Nouvelle demande soumise | Admin | Notification avec lien vers `/admin/demandes/:id` |
| Statut changé | Client | "Votre demande est en cours / traitée" |
| Devis final défini | Client | "Votre devis est prêt : X DT" + lien espace client |
| Nouveau message admin | Client | "Vous avez un message de l'équipe Blechesm" + magic link |
| Nouveau message client | Admin | Notification message entrant |

---

## Sécurité

- Mots de passe admin hachés avec **bcrypt** (salt rounds: 12)
- JWT admin : durée 7 jours, httpOnly cookie, `SameSite=Strict`
- JWT client : durée 24h, httpOnly cookie, `SameSite=Strict`
- Magic link : token random 32 bytes, expiration 15 min, usage unique
- Un client ne peut accéder qu'à **ses propres demandes** (filtre `clientId` en base)
- Rate limiting : `/api/auth/*/login` et `/api/auth/client/magic-link` → max 5 req/min par IP
- CORS : `https://blechesm.vercel.app` uniquement en prod

---

## Migration front-end

Fichiers front à créer/modifier :

| Action | Fichier |
|---|---|
| Modifier | `frontend/src/mocks/api.js` → remplacer par vrais fetch |
| Modifier | `frontend/src/stores/auth.js` → appeler `/api/auth/admin/login` |
| Créer | `frontend/src/stores/client.js` → état client connecté |
| Créer | `frontend/src/views/client/ClientDashboardView.vue` |
| Créer | `frontend/src/views/client/ClientRequestView.vue` |
| Créer | `frontend/src/views/client/ClientLoginView.vue` |
| Modifier | `frontend/src/router/index.js` → ajouter routes `/mon-espace` |

---

## Déploiement

| Service | Usage | Coût |
|---|---|---|
| **Render** | Hébergement Node.js + PostgreSQL | Gratuit (free tier) ou $7/mois (Starter) |
| **Cloudinary** | Stockage images | Gratuit (25GB) |
| **Replicate** | IA génération | ~$0.05/image |
| **Resend** | Emails | Gratuit (3 000/mois) |

Le front reste sur **Vercel** et appelle le backend Render via `VITE_API_URL`.

### Render — Points importants

**Free tier : cold start de ~30 secondes**
Le service s'endort après 15 min d'inactivité. La première requête après une pause réveille le serveur avec un délai visible. Deux options :
- **Option A (dev/proto)** — accepter le cold start, ajouter un message "Chargement..." côté front
- **Option B (prod)** — passer au plan **Starter ($7/mois)** qui garde le serveur toujours actif

**PostgreSQL sur Render**
Render propose un PostgreSQL managé directement dans le dashboard :
1. Dashboard → New → PostgreSQL
2. Copier la `DATABASE_URL` générée dans les variables d'environnement du service Node.js

**Déploiement depuis GitHub**
1. Dashboard → New → Web Service → connecter le repo `blechesm`
2. Root Directory : `backend`
3. Build Command : `npm install && npx prisma migrate deploy`
4. Start Command : `node src/index.js`
5. Variables d'environnement : coller tout le `.env` dans l'interface Render

**`vercel.json` dans `backend/` n'est plus nécessaire** — Render détecte automatiquement le service Node.js.

---

## Architecture — Diagramme de flux

```mermaid
graph TD
    subgraph Frontend ["Frontend (Vercel)"]
        SPA["SPA Vue 3"]
    end

    subgraph Backend ["Backend (Railway — Node.js/Express)"]
        GW["Express Router\n+ Rate Limiter\n+ CORS"]
        MW_A["requireAdmin\n(JWT admin cookie)"]
        MW_C["requireClient\n(JWT client cookie)"]

        subgraph Routes
            R_AUTH_A["POST /api/auth/admin/*"]
            R_AUTH_C["POST /api/auth/client/*"]
            R_GEN["POST /api/generate"]
            R_REQ_PUB["POST /api/requests"]
            R_REQ_ADM["GET|PATCH /api/requests/*"]
            R_REQ_CLI["GET /api/client/requests/*"]
            R_PORT["GET|POST|PUT|DELETE /api/portfolio"]
            R_ACC["GET|POST /api/accounts"]
            R_HEALTH["GET /api/health"]
        end

        subgraph Services
            SVC_AI["ai.js\n(Replicate)"]
            SVC_STORE["storage.js\n(Cloudinary)"]
            SVC_EMAIL["email.js\n(Resend)"]
            SVC_JOB["jobQueue.js\n(in-memory / Bull)"]
        end
    end

    subgraph Data ["Données"]
        DB[("PostgreSQL\n(Railway)")]
        CDN["Cloudinary\n(images)"]
    end

    subgraph External ["Services externes"]
        REPLICATE["Replicate API\n(Stable Diffusion)"]
        RESEND["Resend\n(emails)"]
    end

    SPA --> GW
    GW --> R_AUTH_A & R_AUTH_C & R_GEN & R_REQ_PUB & R_HEALTH
    GW --> MW_A --> R_REQ_ADM & R_PORT & R_ACC
    GW --> MW_C --> R_REQ_CLI
    R_GEN --> SVC_JOB --> SVC_AI --> REPLICATE
    R_REQ_PUB --> SVC_STORE --> CDN
    R_REQ_PUB --> SVC_EMAIL --> RESEND
    R_REQ_ADM --> SVC_EMAIL
    Routes --> DB
```

---

## Génération IA — Pattern asynchrone (IMPORTANT)

**Replicate peut prendre 10 à 60 secondes.** Un appel synchrone timeoutera côté client et côté serveur. L'IA doit être **asynchrone avec polling** :

### Flow recommandé

```
1. POST /api/generate          → { jobId: "cuid_xxx", status: "pending" }
   (upload Cloudinary + enqueue job — retour immédiat < 2s)

2. GET  /api/generate/:jobId   → { status: "pending" | "processing" | "done" | "error", url?: string }
   (le front poll toutes les 2s jusqu'à status "done")

3. Replicate webhook (optionnel) → PATCH interne /api/generate/:jobId/webhook
   (Replicate notifie quand c'est prêt — évite le polling)
```

### Implémentation de la file (dev : in-memory, prod : Bull + Redis)

```js
// services/jobQueue.js
const jobs = new Map() // dev uniquement

export async function enqueueGenerationJob({ jobId, wallPhotoUrl, refPhotoUrl, description, serviceType }) {
  jobs.set(jobId, { status: 'pending', createdAt: Date.now() })

  // Traitement asynchrone — ne pas await
  processJob(jobId, { wallPhotoUrl, refPhotoUrl, description, serviceType })
    .catch(err => jobs.set(jobId, { status: 'error', error: err.message }))

  return jobId
}

async function processJob(jobId, params) {
  jobs.set(jobId, { status: 'processing' })
  const url = await callReplicate(params)           // 10-60s
  jobs.set(jobId, { status: 'done', url })
}
```

> En prod : remplacer `Map` par **Bull + Redis** (Railway propose Redis en add-on).

---

## Resilience & Fault Tolerance

### Replicate API — Retry avec backoff exponentiel

```js
// services/ai.js
async function callReplicateWithRetry(input, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await replicate.run('stability-ai/sdxl', { input })
    } catch (err) {
      if (attempt === maxRetries) throw err
      const delay = Math.min(1000 * 2 ** attempt + Math.random() * 500, 10000)
      await new Promise(r => setTimeout(r, delay)) // backoff: 2s, 4s, 8s
    }
  }
}
```

### Cloudinary — Timeout explicite

```js
cloudinary.config({ timeout: 15000 }) // 15s max, ne pas bloquer indéfiniment
```

### Emails — Fire-and-forget avec log d'erreur

Les emails ne doivent jamais faire échouer une requête principale :

```js
// Toujours wrapper dans try/catch sans re-throw
async function sendEmailSafe(params) {
  try {
    await resend.emails.send(params)
  } catch (err) {
    console.error('[EMAIL_FAIL]', err.message, params.to) // log mais pas d'erreur 500
  }
}
```

---

## Observabilité

### Logging structuré (JSON)

Chaque requête logue un objet JSON structuré pour faciliter la recherche dans Railway Logs :

```js
// middleware/logger.js
app.use((req, res, next) => {
  const start = Date.now()
  const requestId = crypto.randomUUID()
  req.requestId = requestId

  res.on('finish', () => {
    console.log(JSON.stringify({
      requestId,
      method: req.method,
      path: req.path,
      status: res.statusCode,
      durationMs: Date.now() - start,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    }))
  })
  next()
})
```

### Health check endpoint

```
GET /api/health
→ 200 { status: "ok", db: "ok", uptime: 123, version: "1.0.0" }
→ 503 { status: "degraded", db: "error" }  ← si Prisma ne répond pas
```

Utilisé par Railway pour les liveness probes.

### Corrélation des erreurs

Toutes les réponses d'erreur incluent le `requestId` pour permettre de retrouver les logs :

```json
{ "error": "Validation failed", "requestId": "uuid-xxx", "details": [...] }
```

---

## Contrats API — Réponses standardisées

### Format de succès

```json
{ "data": { ... }, "meta": { "requestId": "uuid" } }
```

### Format d'erreur

```json
{
  "error": "MESSAGE_CODE",
  "message": "Description lisible en français",
  "requestId": "uuid",
  "details": []   // champs Zod si validation
}
```

### Codes d'erreur métier

| Code | HTTP | Description |
|---|---|---|
| `INVALID_INPUT` | 400 | Validation Zod échouée |
| `UNAUTHORIZED` | 401 | Token absent ou expiré |
| `FORBIDDEN` | 403 | Accès à une ressource qui n'appartient pas au client |
| `NOT_FOUND` | 404 | Ressource inexistante |
| `MAGIC_LINK_EXPIRED` | 401 | Token magic link expiré ou déjà utilisé |
| `TOO_MANY_REQUESTS` | 429 | Rate limit atteint |
| `UPLOAD_TOO_LARGE` | 413 | Fichier > 10MB |
| `INVALID_FILE_TYPE` | 400 | Type MIME non accepté |
| `AI_GENERATION_FAILED` | 502 | Replicate en erreur après retries |
| `INTERNAL_ERROR` | 500 | Erreur serveur inattendue |

---

## Sécurité renforcée

### Validation des fichiers uploadés

```js
// middleware/upload.js
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024  // 10MB

const upload = multer({
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      return cb(new AppError('INVALID_FILE_TYPE', 400))
    }
    cb(null, true)
  },
  storage: multer.memoryStorage(), // buffer en mémoire → upload direct Cloudinary
})
```

### Idempotence sur soumission de devis

Le client peut accidentellement soumettre deux fois. Ajouter un `idempotencyKey` (hash des données principales) pour détecter les doublons sur 5 minutes :

```js
// Avant de créer la Request, vérifier :
const existing = await prisma.request.findFirst({
  where: { clientId, idempotencyKey, createdAt: { gte: new Date(Date.now() - 5 * 60 * 1000) } }
})
if (existing) return res.json({ data: existing }) // retourne la demande existante
```

### Headers de sécurité (Helmet)

```js
import helmet from 'helmet'
app.use(helmet()) // X-Frame-Options, X-Content-Type-Options, HSTS, etc.
```

### CORS

```js
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://blechesm.vercel.app']
  : ['http://localhost:5173']

app.use(cors({ origin: allowedOrigins, credentials: true }))
```

---

## Caching

### Portfolio — Cache HTTP côté client

Le portfolio ne change pas souvent. Ajouter des headers de cache sur `GET /api/portfolio` :

```js
res.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600') // 5min cache, 10min stale
```

### Requests admin — Pas de cache

Les demandes changent en temps réel → `Cache-Control: no-store`.

---

## Graceful Shutdown

```js
// index.js
process.on('SIGTERM', async () => {
  console.log('[SHUTDOWN] Signal reçu, fermeture propre...')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('[SHUTDOWN] OK')
    process.exit(0)
  })
  setTimeout(() => process.exit(1), 10000) // force exit après 10s
})
```

---

## Ordre d'implémentation

### Phase 1 — Fondations (Jour 1-2)
1. **Setup** — `npm init`, Express 5, Prisma + SQLite, `.env`, Helmet, CORS, logger structuré
2. **Health check** — `GET /api/health` + graceful shutdown
3. **Error handler global** — format d'erreur standardisé + requestId

### Phase 2 — Auth (Jour 3-4)
4. **Auth Admin** — login/logout/me + middleware `requireAdmin` + rate limiting
5. **Auth Client** — magic link + verify + middleware `requireClient`

### Phase 3 — Core métier (Jour 5-8)
6. **Upload Cloudinary** — middleware Multer + service storage.js (validation MIME + taille)
7. **Requests publiques** — `POST /api/requests` avec idempotence + upload + email async
8. **Requests admin** — GET list (filtres status) + GET detail + PATCH
9. **Requests client** — GET liste + GET detail (scope clientId strict)
10. **Messages** — thread admin ↔ client + notifications email

### Phase 4 — Features secondaires (Jour 9-11)
11. **Portfolio** — CRUD + cache headers
12. **Accounts admin** — CRUD
13. **IA Generation async** — POST /api/generate → jobId + GET /api/generate/:jobId polling

### Phase 5 — Migration & déploiement (Jour 12-14)
14. **Migration front** — remplacer `api.js` mock + créer vues client `/mon-espace`
15. **Tests** — smoke tests Insomnia sur tous les endpoints
16. **Déploiement Railway** — PostgreSQL + variables d'env + domaine custom

---

## Variables d'environnement — Guide complet

### `.env` complet à créer dans `backend/`

```env
# ─── Base de données ───────────────────────────────────────────────
DATABASE_URL="file:./dev.db"
# En prod (Railway PostgreSQL) :
# DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# ─── Auth JWT ─────────────────────────────────────────────────────
# Générer avec : node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_ADMIN_SECRET="remplacer_par_64_bytes_random_hex"
JWT_CLIENT_SECRET="remplacer_par_64_bytes_random_hex_different"

# ─── Cloudinary ───────────────────────────────────────────────────
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"

# ─── Replicate IA ─────────────────────────────────────────────────
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxxxxxxxxx"

# ─── Resend emails ────────────────────────────────────────────────
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
RESEND_FROM="noreply@blechesm.fr"
ADMIN_EMAIL="contact@blechesm.fr"

# ─── App ──────────────────────────────────────────────────────────
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

---

### Services à créer et où trouver les clés

#### 1. Cloudinary — Stockage des photos
**Compte gratuit : 25 GB stockage, 25 GB bande passante/mois**

1. S'inscrire sur **cloudinary.com**
2. Dashboard → Settings → API Keys
3. Récupérer : `Cloud Name`, `API Key`, `API Secret`

```env
CLOUDINARY_CLOUD_NAME="dxxxxxx"        # affiché sur le dashboard
CLOUDINARY_API_KEY="123456789012345"   # onglet API Keys
CLOUDINARY_API_SECRET="xxxx-xxxxx"    # onglet API Keys (cliquer "Reveal")
```

---

#### 2. Replicate — Génération IA (Stable Diffusion)
**Pay-as-you-go : ~$0.05 par image générée**

1. S'inscrire sur **replicate.com** (avec GitHub)
2. Account Settings → API Tokens → Create token
3. Récupérer le token commençant par `r8_`

```env
REPLICATE_API_TOKEN="r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

> Le modèle utilisé sera `stability-ai/stable-diffusion-img2img` pour le rendu sur photo existante.

### Mode dev — Mock sans appel Replicate

Replicate est **pay-as-you-go uniquement** (pas de free tier illimitée). Les nouveaux comptes reçoivent quelques dollars de crédit au signup (~1 000 images à $0.004/image sur SDXL).

**En dev, on ne consomme aucun crédit** — le service retourne une image placeholder :

```js
// services/ai.js
export async function generateImage(params) {
  if (process.env.NODE_ENV !== 'production') {
    // Dev : placeholder Unsplash après 2s (simule le délai Replicate)
    await new Promise(r => setTimeout(r, 2000))
    const placeholders = [
      'https://images.unsplash.com/photo-1547234935-80c7145ec969?w=1200',
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200',
      'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=1200',
    ]
    return placeholders[Math.floor(Math.random() * placeholders.length)]
  }

  // Prod uniquement : vrai appel Replicate
  return await callReplicateWithRetry(params)
}
```

`REPLICATE_API_TOKEN` n'est donc **pas nécessaire en dev local** — seulement en prod sur Render.

---

#### 3. Resend — Emails transactionnels
**Plan gratuit : 3 000 emails/mois**

1. S'inscrire sur **resend.com**
2. API Keys → Create API Key (accès "Full access")
3. Domains → Add Domain → vérifier DNS de `blechesm.fr` (enregistrement TXT + MX)
   - Sans domaine vérifié : utiliser `onboarding@resend.dev` en dev uniquement
4. Récupérer la clé commençant par `re_`

```env
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxx"
RESEND_FROM="noreply@blechesm.fr"    # après vérification domaine
# En dev sans domaine :
# RESEND_FROM="onboarding@resend.dev"
ADMIN_EMAIL="belgacem.dahmen@gmail.com"
```

---

#### 4. Railway — Hébergement backend + PostgreSQL (prod uniquement)
**Plan Hobby : $5/mois (inclut PostgreSQL)**

1. S'inscrire sur **railway.app** (avec GitHub)
2. New Project → Deploy from GitHub → sélectionner le repo `blechesm`
3. Add Plugin → PostgreSQL → Railway génère automatiquement `DATABASE_URL`
4. Variables → copier toutes les variables `.env` dans l'interface Railway

---

#### 5. JWT Secrets — À générer soi-même
Pas de service externe — générer localement :

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Lancer deux fois pour avoir deux secrets distincts (`JWT_ADMIN_SECRET` et `JWT_CLIENT_SECRET`).

---

### Récapitulatif — Ce qu'il faut préparer avant de commencer

| # | Service | Inscription | Temps estimé | Coût |
|---|---|---|---|---|
| 1 | **Cloudinary** | cloudinary.com | 5 min | Gratuit |
| 2 | **Replicate** | replicate.com | 5 min | Pay-as-you-go (~$0.05/image) |
| 3 | **Resend** | resend.com | 10 min + vérif DNS | Gratuit jusqu'à 3k emails/mois |
| 4 | **Railway** | railway.app | 10 min | $5/mois (prod seulement) |
| 5 | **JWT Secrets** | `node -e ...` | 1 min | Gratuit |

> **En dev local**, Railway n'est pas nécessaire — SQLite suffit (`DATABASE_URL="file:./dev.db"`).
> Seul Cloudinary et Replicate sont nécessaires dès le départ pour tester la génération IA.
