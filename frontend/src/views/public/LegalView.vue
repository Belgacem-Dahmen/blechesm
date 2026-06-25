<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-24 overflow-hidden hero-section">
      <div class="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div class="spray spray-purple absolute -top-12 -right-12 w-[240px] h-[240px]" style="opacity:0.04" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 mb-6 h-eyebrow">
          <span class="w-6 h-px bg-accent" />
          <span class="text-xs font-mono uppercase tracking-widest text-accent">Légal</span>
          <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
            <path d="M3,11 C12,4 30,4 42,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M35,6 L43,12 L35,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <h1 class="font-display text-5xl sm:text-6xl font-semibold tracking-tightest leading-[0.9] mb-5 h-title">
          Mentions légales<br />
          <span class="relative inline-block text-accent">
            &amp; CGU
            <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 120 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
              <path d="M0,4 Q30,0 60,4 Q90,8 120,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
            </svg>
          </span>
        </h1>

        <div class="flex items-center gap-3 h-meta">
          <span class="font-mono text-xs font-bold uppercase tracking-widest px-2.5 py-1 border border-warning/40 text-warning rounded-sm"
            style="background: rgba(251,191,36,0.07)">Mise à jour</span>
          <span class="text-text-3 text-sm">Juin 2024</span>
        </div>
      </div>

    </section>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid lg:grid-cols-4 gap-10 lg:gap-14 items-start">

        <!-- ── SIDEBAR TOC ────────────────────────────────────────── -->
        <aside class="lg:sticky lg:top-24 toc-col">
          <div class="bg-surface-1 border border-border rounded-xl p-5">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-4 h-px bg-accent" />
              <p class="font-mono text-xs uppercase tracking-widest text-accent">Sommaire</p>
            </div>
            <nav class="space-y-1">
              <a
                v-for="(s, i) in sections"
                :key="s.id"
                :href="`#${s.id}`"
                class="toc-link"
                :style="{ '--tl': s.color }"
              >
                <span class="toc-num" :style="{ color: s.color }">{{ String(i+1).padStart(2,'0') }}</span>
                {{ s.title }}
              </a>
            </nav>
          </div>
        </aside>

        <!-- ── SECTIONS ──────────────────────────────────────────── -->
        <div class="lg:col-span-3 space-y-5 content-col">

          <div
            v-for="(s, i) in sections"
            :key="s.id"
            :id="s.id"
            class="legal-card"
            :style="{ '--lc': s.color, animationDelay: `${i * 0.06}s` }"
          >
            <!-- Colored left accent -->
            <div class="legal-accent" />

            <div class="flex items-start gap-4">
              <!-- Number badge -->
              <div class="legal-num-badge shrink-0" :style="{ background: s.color + '18', color: s.color, border: `1px solid ${s.color}40` }">
                {{ String(i+1).padStart(2,'0') }}
              </div>

              <div class="flex-1 min-w-0">
                <h2 class="font-display font-semibold text-text text-xl mb-4 leading-tight">{{ s.title }}</h2>
                <div class="space-y-3 text-text-2 text-sm leading-relaxed">
                  <p v-for="(p, j) in s.paragraphs" :key="j">{{ p }}</p>
                  <!-- Optional list -->
                  <ul v-if="s.items" class="space-y-1.5 mt-2">
                    <li v-for="item in s.items" :key="item" class="flex items-start gap-2">
                      <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: s.color }" />
                      {{ item }}
                    </li>
                  </ul>
                  <!-- Optional contact link -->
                  <a v-if="s.email" :href="`mailto:${s.email}`" class="inline-flex items-center gap-1.5 text-accent hover:underline text-sm font-medium">
                    {{ s.email }}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2,6 H10 M7,3 L10,6 L7,9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Back to top -->
          <div class="flex items-center justify-center pt-6">
            <a href="#" class="flex items-center gap-2 text-text-3 text-xs hover:text-accent transition-colors font-mono uppercase tracking-widest group">
              <svg width="16" height="16" viewBox="0 0 16 16" class="group-hover:-translate-y-0.5 transition-transform" fill="none">
                <path d="M8,12 V4 M4,7 L8,3 L12,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Retour en haut
            </a>
          </div>
        </div>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'

const sections = [
  {
    id: 'editeur',
    title: 'Éditeur du site',
    color: '#3D7BFF',
    paragraphs: [
      'Blech Esm — Collectif d\'artistes muralistes',
      'Siège social : 112 Rue de La Palestine, Tunis, 1002, Tunisie',
      'Téléphone : +216 50 133 961',
    ],
    email: 'blechesmcom@gmail.com',
  },
  {
    id: 'directeur',
    title: 'Directeur de la publication',
    color: '#FB923C',
    paragraphs: ['Blech Esm — blechesmcom@gmail.com'],
  },
  {
    id: 'hebergement',
    title: 'Hébergement',
    color: '#4ADE80',
    paragraphs: [
      'Ce site est hébergé par Vercel Inc., 340 Pine Street, Suite 900, San Francisco, CA 94104, USA.',
    ],
  },
  {
    id: 'propriete',
    title: 'Propriété intellectuelle',
    color: '#F472B6',
    paragraphs: [
      "L'ensemble du contenu de ce site (textes, images, vidéos, logos, fresques représentées) est la propriété exclusive de Blechesm ou de ses partenaires artistes.",
      "Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
    ],
  },
  {
    id: 'donnees',
    title: 'Protection des données personnelles',
    color: '#22D3EE',
    paragraphs: [
      "Les données collectées via les formulaires (nom, email, téléphone) sont utilisées uniquement pour traiter votre demande de devis. Elles ne sont jamais cédées à des tiers.",
      "Conformément au RGPD, vous disposez des droits suivants :",
    ],
    items: [
      "Droit d'accès à vos données personnelles",
      "Droit de rectification des informations inexactes",
      "Droit à l'effacement (droit à l'oubli)",
      "Droit à la portabilité de vos données",
    ],
    email: 'blechesmcom@gmail.com',
  },
  {
    id: 'cookies',
    title: 'Cookies',
    color: '#A78BFA',
    paragraphs: [
      "Ce site n'utilise pas de cookies publicitaires ou de tracking tiers.",
      "Des cookies techniques strictement nécessaires au fonctionnement du site peuvent être déposés pour maintenir votre session et mémoriser vos préférences.",
    ],
  },
  {
    id: 'cgu',
    title: "Conditions générales d'utilisation",
    color: '#FBBF24',
    paragraphs: [
      "L'utilisation de cet outil de visualisation IA est gratuite et sans engagement. Les images générées sont des aperçus non contractuels.",
      "Le résultat final peut différer de la visualisation en fonction des contraintes techniques et artistiques du mur, des matériaux et des conditions d'intervention.",
      "Blechesm se réserve le droit de modifier ces CGU à tout moment. La version en vigueur est celle publiée sur cette page.",
    ],
  },
]
</script>

<style scoped>
/* ── Spray blobs ────────────────────────────────────────────────── */
.spray {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.07;
  pointer-events: none;
}
.hero-section {
  background: linear-gradient(180deg, var(--color-surface-1) 0%, var(--color-bg) 90%);
  border-bottom: 1px solid var(--color-border);
}
.spray-purple { background: #A78BFA; }
.spray-cyan   { background: #22D3EE; }

/* ── Hero animations ────────────────────────────────────────────── */
.h-eyebrow { animation: fade-up 0.5s ease 0.05s both; }
.h-title   { animation: fade-up 0.65s ease 0.15s both; }
.h-meta    { animation: fade-up 0.5s ease 0.28s both; }
.toc-col   { animation: fade-up 0.5s ease 0.1s both; }
.content-col { animation: fade-up 0.5s ease 0.2s both; }

/* ── TOC ────────────────────────────────────────────────────────── */
.toc-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  font-size: 13px;
  color: var(--color-text-2);
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  border-left: 2px solid transparent;
}
.toc-link:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
  border-left-color: var(--tl);
}
.toc-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  width: 22px;
  flex-shrink: 0;
}

/* ── Legal cards ────────────────────────────────────────────────── */
.legal-card {
  position: relative;
  display: flex;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px;
  overflow: hidden;
  animation: fade-up 0.4s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.legal-card:hover {
  border-color: var(--lc);
  box-shadow: 0 0 0 1px rgba(0,0,0,0.05), -3px 0 0 var(--lc);
}

/* Colored left accent bar */
.legal-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--lc);
  border-radius: 12px 0 0 12px;
  opacity: 0.7;
  transition: opacity 0.2s, width 0.2s;
}
.legal-card:hover .legal-accent { opacity: 1; width: 4px; }

/* Number badge */
.legal-num-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.05em;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-eyebrow, .h-title, .h-meta,
  .toc-col, .content-col, .legal-card { animation: none; }
  .legal-card, .legal-accent { transition: none; }
}
</style>
