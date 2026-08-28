# Blech Esm — بلاش إسم

> Plateforme web de devis en ligne pour un studio de street art & fresques murales basé à Tunis.

---

## Aperçu

Blech Esm est un studio tunisien spécialisé dans les **fresques murales**, **sculptures 3D** et **design sol**. Cette plateforme permet aux clients de :

1. **Configurer** leur projet en 5 étapes (type de service, photos, dimensions, description IA, coordonnées)
2. **Visualiser** leur fresque via une génération d'image par IA (Google Gemini)
3. **Recevoir** automatiquement un devis personnalisé sous 48h

L'espace admin permet à l'équipe de gérer les demandes, communiquer avec les clients, mettre à jour les statuts et publier des réalisations au portfolio.

---

## Stack technique

| Côté | Technologies |
|---|---|
| **Frontend** | Vue 3 · Vite · Pinia · Tailwind CSS v3 · motion-v · Lucide |
| **Backend** | Node.js · Express · TypeScript · Prisma ORM |
| **Base de données** | PostgreSQL (Neon) |
| **IA** | Google Gemini 2.5 Flash Image (génération de fresques) |
| **Stockage** | Cloudinary (photos & images générées) |
| **Emails** | Resend (confirmation, notifications, magic links) |
| **Déploiement** | Vercel (frontend) · Render (backend) |

---

## Structure du projet

```
blechesm/
├── frontend/          # SPA Vue 3 — déployée sur Vercel
│   ├── src/
│   │   ├── views/     # Vues publiques + admin
│   │   ├── components/# Composants UI réutilisables
│   │   ├── stores/    # Pinia (request, auth)
│   │   ├── mocks/     # Couche API (appels axios vers le backend)
│   │   └── styles/    # Variables CSS + Tailwind config
│   └── vercel.json
│
└── backend/           # API REST Express — déployée sur Render
    ├── src/
    │   ├── routes/    # auth, requests (public + admin), portfolio, accounts, generate
    │   ├── services/  # ai.ts (Gemini), storage.ts (Cloudinary), email.ts (Resend)
    │   ├── middleware/ # requireAdmin, upload, validate
    │   └── lib/       # prisma, errors
    ├── prisma/
    │   ├── schema.prisma
    │   ├── migrations/
    │   └── seed.ts    # Crée le compte admin initial
    └── render.yaml
```

---

## Démarrage local

### Prérequis
- Node.js ≥ 20
- Une base PostgreSQL (ou compte [Neon](https://neon.tech) gratuit)

### Backend

```bash
cd backend
cp .env.example .env        # Remplir les variables (voir ci-dessous)
npm install
npx prisma migrate deploy   # Applique les migrations
npx prisma db seed          # Crée l'admin initial
npm run dev                 # Démarre sur http://localhost:3001
```

### Frontend

```bash
cd frontend
cp .env.example .env        # Renseigner VITE_API_URL=http://localhost:3001
npm install
npm run dev                 # Démarre sur http://localhost:5173
```

---

## Variables d'environnement (backend)

Créer `backend/.env` à partir de `backend/.env.example` :

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ADMIN_SECRET` | Secret pour les tokens JWT admin |
| `GOOGLE_AI_API_KEY` | Clé API Google Gemini (génération d'images) |
| `CLOUDINARY_URL` | Connection string Cloudinary |
| `RESEND_API_KEY` | Clé API Resend (emails transactionnels) |
| `RESEND_FROM` | Adresse expéditrice (ex. `noreply@blechesm.tn`) |
| `ADMIN_EMAIL` | Email de l'équipe pour les notifications |
| `FRONTEND_URL` | URL du frontend pour CORS |

---

## Déploiement

### Frontend — Vercel
- Root Directory : `frontend`
- Les rewrites SPA sont gérés par `frontend/vercel.json`

### Backend — Render
Deux services distincts pour isoler les environnements :

| Service | Branch | Base de données |
|---|---|---|
| `blechesm-dev` | `dev` | Neon dev |
| `blechesm-prod` | `main` | Neon prod |

Le build command : `npm run build` exécute `prisma generate && tsc` — le client Prisma est toujours regénéré avant la compilation TypeScript.

---

## Fonctionnalités

### Espace public
- Wizard 5 étapes avec sélection du type de service
- Upload de photos (mur + référence visuelle)
- Chat IA pour construire la description du projet
- Génération de fresque par Google Gemini avec polling temps réel
- Soumission automatique de la demande de devis après génération
- Portfolio des réalisations

### Espace admin (`/admin`)
- Dashboard des demandes avec KPIs (total, nouvelles, en cours, CA généré)
- Filtres par statut et type de service
- Vue détail : galerie d'images, messagerie client, gestion du statut et du prix
- Gestion du portfolio (ajout, modification, suppression)
- Gestion des comptes admin

---

## Contact

**Blech Esm — بلاش إسم**
112 Rue de La Palestine, Tunis 1002, Tunisie
📞 +216 50 133 961
📧 blechesmcom@gmail.com
🌐 [Instagram](https://www.instagram.com/blech.esm/) · [Facebook](https://www.facebook.com/blecheseem/)
