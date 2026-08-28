# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Monorepo with two independent apps:

```
blechesm/
├── frontend/   # Vue 3 SPA (Vite) — deployed on Vercel
└── backend/    # Express + TypeScript API — deployed on Render
```

## Commands

**Frontend** — run from `frontend/`:
```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
```

**Backend** — run from `backend/`:
```bash
npm run dev        # tsx watch (hot reload)
npm run build      # prisma generate && tsc
npm start          # node dist/index.js
npx prisma migrate deploy   # Apply migrations to DB
npx prisma db seed          # Seed initial admin (admin@demo.com / demo)
```

No test suite is configured.

## Deployment

### Frontend — Vercel
- **Root Directory:** `frontend`
- `frontend/vercel.json` handles build config and SPA rewrites

### Backend — Render
- **Root Directory:** `backend`
- Build command: `npm run build` (runs `prisma generate && tsc`)
- Start command: `npm start`
- Two separate Render services, one per branch:
  - `blechesm-dev` → branch `dev` → `DATABASE_URL` = Neon dev DB
  - `blechesm-prod` → branch `main` → `DATABASE_URL` = production DB
- On first deploy, run `npx prisma migrate deploy` then `npx prisma db seed`

### Environment variables (backend)
| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (Neon) |
| `JWT_ADMIN_SECRET` | Secret for admin JWT tokens |
| `GOOGLE_AI_API_KEY` | Gemini API key (image generation) |
| `CLOUDINARY_URL` | Cloudinary connection string (image storage) |
| `RESEND_API_KEY` | Resend API key (transactional emails) |
| `FRONTEND_URL` | Frontend origin for CORS |

## Architecture

### Stack
- **Frontend:** Vue 3 + Vite + Pinia + Tailwind CSS v3 + motion-v + Lucide icons. No UI library — all components are custom-built.
- **Backend:** Express + TypeScript + Prisma ORM + PostgreSQL (Neon) + Cloudinary + Gemini AI + Resend

### Data Flow (User Quote Request)
The core user journey is a **5-step wizard** managed by `useRequestStore`:
1. `/configurateur` step 1 — choose service type (mural / sculpture / sol)
2. `/configurateur` step 2 — upload wall photo + optional reference photo
3. `/configurateur` step 3 — dimensions / material / surface finish
4. `/configurateur` step 4 — AI chat assistant builds the description
5. `/configurateur` step 5 — name, email, phone, budget (required before generation)
   → click "Générer" → calls `generateFresco()` (Gemini AI, 30–60s) → auto-submits quote request → redirects to `/resultat`
6. `/resultat` — shows before/after images + confirmation "Demande envoyée"

The store persists across route changes but resets on page refresh (in-memory only).
`/devis` still exists as a standalone page but is no longer in the main funnel.

### API Layer
`frontend/src/mocks/api.js` — real HTTP calls via axios to the backend. Contains:
- `toRequest()` transformer: maps backend snake_case fields → frontend camelCase shape (includes `budget`)
- `generateFresco(wallPhoto, refPhoto, description, serviceType)` — POST `/api/generate` → polls job until done
- `submitQuote(data)` — POST `/api/requests` with FormData
- `sendMessage(id, content)` — POST `/api/requests/:id/messages`

### AI Generation (backend)
`backend/src/services/ai.ts` — Google Gemini 2.5 Flash Image via native `fetch` (no SDK, avoids ESM/CJS conflict).
- Model: `gemini-2.5-flash-image`
- Three modes: wall+ref → mural placement | wall only → generate mural | no image → text-to-image
- Returns base64 → uploaded to Cloudinary → returns URL
- Job queue pattern: POST `/api/generate` returns `{ jobId }`, frontend polls GET `/api/generate/:jobId`

### Auth
- **Admin:** JWT stored in httpOnly cookie (`adminToken`, 7d). `requireAdmin` middleware validates on every protected route. Login: `POST /api/auth/admin/login`.
- **Admin credentials (seeded):** `admin@demo.com` / `demo`
- Router guard in `frontend/src/router/index.js` checks `requiresAuth` meta + `isAuthenticated`.

### Database (Prisma)
Models: `Admin`, `Client`, `Request`, `Message`, `Portfolio`.

Key `Request` fields: `serviceType`, `description`, `wallPhotoUrl`, `referencePhotoUrl`, `generatedImageUrl`, `budget` (String), `finalPrice` (Float), `internalNotes`, `status` (`nouveau` | `en_cours` | `traite` | `annule`), `idempotencyKey`.

When adding a field: update `schema.prisma` → create migration SQL in `prisma/migrations/` → `prisma generate` runs automatically on next build.

### Design System
All colors are CSS variables in `src/styles/main.css` (`:root` block), then exposed as Tailwind tokens in `tailwind.config.js`. Never use hardcoded hex values in components — always use Tailwind classes (`bg-accent`, `text-text-2`, `border-border-strong`, etc.) or `var(--token-name)` inline styles.

Key tokens: `--bg` (#080B14), `--surface-1/2/3` (navy variants), `--accent` (#3D7BFF), `--accent-warm` (#FF6B35), `--success` (#4ADE80), `--warning` (#F6B84E).

### CSS Rules — Tailwind First (STRICT)
**Always use Tailwind utility classes for all styling. Scoped `<style>` blocks are forbidden except for the two cases below.**

- **All layout, spacing, color, typography, borders, shadows, transitions, hover states** → Tailwind classes on the element.
- **Arbitrary values** when no Tailwind token exists → `class="w-[500px]"`, `class="opacity-[0.045]"`, etc.
- **Inline `:style`** only for truly dynamic values that depend on reactive data (e.g. `--tc`, `--delay` CSS vars driven by `v-for` data).
- **`<style scoped>` is only allowed for:**
  1. `@keyframes` definitions (cannot be expressed in Tailwind)
  2. Complex multi-state CSS that requires a child selector Tailwind cannot target (e.g. `.parent:hover .child`)
- **Never write a scoped CSS class** when the same result can be achieved with Tailwind utilities — even if it takes several classes.
- **Never use hardcoded hex colors** in `<style>` blocks or `:style` bindings — use `var(--color-*)` tokens.

### Animation
`src/utils/motion.js` exports `EASE = [0.22, 1, 0.36, 1]` and preset variants (`fadeUp`, `stagger`, `heroSequence`, etc.) for use with motion-v's `<Motion>` component. All scroll reveals use `viewport={{ once: true }}`. The global reduced-motion media query in `main.css` disables all transitions/animations.

### Component Conventions
- `BaseButton` — variants: `primary` / `secondary` / `ghost` / `danger`; sizes: `sm` / `md` / `lg`
- `BaseInput` — supports `type`, `label`, `error`, `hint`, `rows` (textarea), `#prefix` slot; emits `update:modelValue`
- `FileDropzone` — drag-and-drop file input; emits `update:modelValue` with File object
- `BlechEsmLoader` — 3D spinning logo loader, props: `size` (default `96px`), `label`. Use in admin for all loading states.
- `AdminLayout` — wraps all admin views, provides sidebar + topbar; admin views must not include their own NavBar/Footer
- `ConfirmDialog` + `useConfirm` composable — use for all destructive actions in admin

### Route Structure
Public routes: `/`, `/configurateur`, `/resultat`, `/devis`, `/portfolio`, `/contact`, and magic-link auth.
Admin routes (all guarded, under `/admin/*`): `/admin/login`, `/admin/demandes`, `/admin/demandes/:id`, `/admin/portfolio`, `/admin/comptes`.
Views are lazy-loaded. Path alias `@` → `src/`.

### Visual Identity
- **Public pages:** street art / graffiti aesthetic — spray blob backgrounds (`.spray` + `.spray-{color}` in scoped CSS), grid blueprint overlays (`.grid-bg`), monospace eyebrows, sticker tags.
- **Admin area:** intentionally sober — no spray effects, clean layouts. Use `BlechEsmLoader` for loading states. Status colors: nouveau `#3D7BFF` · en_cours `#F6B84E` · traite `#4ADE80` · annule `#F87171`. Service colors: mural `#3D7BFF` · sculpture `#A78BFA` · sol `#FF6B35`.
