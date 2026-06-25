<template>
  <div ref="pageEl" class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── 1. HERO ─────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-32 overflow-hidden hero-section">
      <div class="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div class="spray spray-orange absolute -top-12 -right-12 w-[280px] h-[280px]" style="opacity:0.045" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-start justify-between gap-8">

          <div class="max-w-3xl">
            <div class="flex items-center gap-3 mb-6 h-eyebrow">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">À propos</span>
              <svg width="56" height="24" viewBox="0 0 56 24" class="text-warning opacity-65 hidden sm:block" fill="none" aria-hidden="true">
                <path d="M4,12 C14,4 32,4 46,12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M40,7 L47,13 L39,17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[0.9] mb-6 h-title">
              L'art mural<br />
              <span class="relative inline-block text-accent">
                au service
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q40,0 80,4 Q120,8 160,4 Q200,0 240,4 Q280,8 300,4" stroke="#FF6B35" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
              <br />de votre espace.
            </h1>

            <p class="text-text-2 text-lg leading-relaxed mb-10 max-w-xl h-sub">
              Blech Esm est un collectif d'artistes muralistes professionnels basé à Tunis.
              Depuis 2016, nous transformons des murs ordinaires en œuvres d'art extraordinaires.
            </p>

            <div class="flex flex-wrap gap-10 h-stats">
              <div v-for="s in heroStats" :key="s.label">
                <p class="font-display text-3xl font-semibold" :style="{ color: s.color }">{{ s.value }}</p>
                <p class="text-text-3 text-xs mt-0.5 tracking-wide">{{ s.label }}</p>
              </div>
            </div>
          </div>

          <!-- Sticker column -->
          <div class="hidden lg:flex flex-col items-end gap-3 pt-16 shrink-0 h-stickers">
            <svg width="28" height="64" viewBox="0 0 28 64" class="text-text-3 opacity-40 mb-1" fill="none" aria-hidden="true">
              <path d="M14,4 C14,22 6,36 14,56" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 4"/>
              <path d="M8,50 L14,58 L20,50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div
              v-for="(sticker, i) in stickers"
              :key="sticker.label"
              class="sticker"
              :style="{ '--sc': sticker.color, transform: `rotate(${sticker.rotate}deg)`, animationDelay: `${0.3 + i * 0.09}s` }"
            >{{ sticker.label }}</div>
          </div>
        </div>
      </div>

    </section>

    <!-- ── 2. MISSION ─────────────────────────────────────────────── -->
    <section class="relative py-24 overflow-hidden">
      <div class="spray spray-green absolute -top-32 right-0 w-[420px] h-[420px]" />
      <div class="spray spray-pink absolute -bottom-32 left-0 w-[360px] h-[360px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-14 lg:gap-24 items-center">

          <div data-reveal>
            <div class="relative">
              <div class="absolute -top-2 -left-2 w-full h-full rounded-xl border-2 border-warning/35 pointer-events-none z-0" />
              <div class="absolute -top-4 -left-4 w-full h-full rounded-xl border border-accent/20 pointer-events-none z-0" />
              <div class="relative aspect-[4/3] rounded-xl overflow-hidden border border-border z-10">
                <img :src="missionImage" alt="Fresque murale Blechesm" class="w-full h-full object-cover" />
                <div class="grain-overlay" />
              </div>
              <div class="absolute -bottom-5 -right-5 z-20 bg-accent text-white px-4 py-3 rounded-lg shadow-2xl">
                <p class="font-mono text-[10px] font-bold tracking-[0.15em] uppercase opacity-80">Depuis</p>
                <p class="font-display font-semibold text-2xl leading-none">2016</p>
              </div>
            </div>
          </div>

          <div data-reveal style="--delay: 0.15s">
            <Pill class="mb-5">Notre mission</Pill>
            <h2 class="font-display text-3xl sm:text-4xl font-semibold tracking-tighter mb-6 leading-tight">
              L'art doit être<br />
              <span class="text-accent">accessible</span> et durable.
            </h2>

            <blockquote class="border-l-[3px] border-warning pl-5 mb-6 py-1">
              <p class="text-text font-display font-medium text-lg leading-relaxed">
                "Chaque mur est une opportunité. Un espace vide devient un message, une identité, une émotion."
              </p>
            </blockquote>

            <p class="text-text-2 leading-relaxed mb-4">
              Notre processus commence par l'écoute. Nous utilisons notre outil de visualisation IA pour co-créer avec vous avant même de toucher un pinceau.
            </p>
            <p class="text-text-2 leading-relaxed mb-8">
              Chaque projet est unique — nous adaptons notre style, nos techniques et nos matériaux à votre espace, votre identité et votre budget.
            </p>

            <RouterLink to="/configurateur" class="inline-flex items-center gap-2 text-accent font-medium text-sm group">
              Visualiser ma fresque
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 3. TIMELINE ────────────────────────────────────────────── -->
    <section class="py-14 border-y border-border bg-surface-1/25">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div class="flex items-center gap-3 mb-10" data-reveal>
          <span class="w-5 h-px bg-text-3" />
          <span class="text-xs font-mono uppercase tracking-widest text-text-3">Notre parcours</span>
          <svg width="36" height="16" viewBox="0 0 36 16" fill="none" class="text-text-3 opacity-55" aria-hidden="true">
            <path d="M2,8 Q14,2 26,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M22,5 L27,8 L22,11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="relative flex justify-between items-start gap-2" data-reveal style="--delay: 0.1s">
          <!-- Continuous background line -->
          <div class="absolute top-[5px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent pointer-events-none" />

          <div
            v-for="(m, i) in milestones"
            :key="m.year"
            class="timeline-item flex-1 min-w-0"
            :style="{ '--mc': m.color, '--delay': `${i * 0.08}s` }"
            data-reveal
          >
            <div class="relative z-10 w-[10px] h-[10px] rounded-full mb-4 timeline-dot"
              :style="{ background: m.color, boxShadow: `0 0 12px ${m.color}90` }"
            />
            <p class="font-mono text-xs font-bold tracking-wider mb-1" :style="{ color: m.color }">{{ m.year }}</p>
            <p class="text-text-2 font-display font-semibold text-sm leading-snug pr-3">{{ m.event }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 4. ARTISTS ─────────────────────────────────────────────── -->
    <section class="relative py-24 overflow-hidden">
      <div class="spray spray-purple absolute -top-24 right-0 w-[420px] h-[420px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between gap-6 mb-14" data-reveal>
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">L'équipe</span>
            </div>
            <h2 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest leading-[0.95]">
              Les <span class="text-accent">artistes</span>
            </h2>
          </div>
          <svg width="80" height="40" viewBox="0 0 80 40" class="text-warning opacity-50 hidden sm:block shrink-0 mb-2" fill="none" aria-hidden="true">
            <path d="M4,20 C16,8 50,6 68,20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M60,12 L70,20 L60,28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(artist, i) in artists"
            :key="artist.name"
            class="artist-card"
            :style="{ '--ac': artist.color, '--delay': `${i * 0.12}s` }"
            data-reveal
          >
            <div class="artist-topbar" />
            <div class="relative overflow-hidden bg-surface-2 aspect-square">
              <img :src="artist.photo" :alt="artist.name" class="artist-photo" loading="lazy" />
              <div class="grain-overlay" />
              <div class="absolute top-3 right-3 px-2.5 py-1 rounded-pill text-xs font-bold font-mono uppercase tracking-wider"
                :style="{ background: artist.color, color: '#080B14' }"
              >{{ artist.tag }}</div>
            </div>
            <div class="p-5">
              <h3 class="font-display font-semibold text-text text-lg leading-tight">{{ artist.name }}</h3>
              <p class="text-sm font-semibold mt-0.5 mb-3" :style="{ color: artist.color }">{{ artist.role }}</p>
              <p class="text-text-2 text-sm leading-relaxed mb-4">{{ artist.bio }}</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="spec in artist.specialties"
                  :key="spec"
                  class="text-xs px-2 py-0.5 rounded-pill border font-medium"
                  :style="{
                    color: artist.color,
                    borderColor: hexAlpha(artist.color, 0.4),
                    background: hexAlpha(artist.color, 0.1),
                  }"
                >{{ spec }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── 5. VALUES ──────────────────────────────────────────────── -->
    <section class="relative py-24 overflow-hidden">
      <div class="absolute inset-0 bg-surface-1/30 pointer-events-none" />
      <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none" />
      <div class="spray spray-orange absolute -bottom-32 -right-32 w-[500px] h-[500px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-14" data-reveal>
          <div class="flex items-center gap-3 mb-4">
            <span class="w-6 h-px bg-accent" />
            <span class="text-xs font-mono uppercase tracking-widest text-accent">Notre démarche</span>
          </div>
          <h2 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest leading-[0.95]">
            Ce qui nous <span class="text-accent">guide</span>
          </h2>
        </div>

        <div class="grid sm:grid-cols-3 gap-6">
          <div
            v-for="(v, i) in values"
            :key="v.title"
            class="value-card"
            :style="{ '--vc': v.color, '--delay': `${i * 0.1}s` }"
            data-reveal
          >
            <div class="value-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <div class="relative z-10 p-7">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300"
                :style="{ background: hexAlpha(v.color, 0.14), color: v.color }"
              >
                <component :is="v.icon" class="w-6 h-6" />
              </div>
              <h3 class="font-display font-semibold text-text text-xl mb-3">{{ v.title }}</h3>
              <p class="text-text-2 text-sm leading-relaxed">{{ v.desc }}</p>
            </div>
            <div class="value-line" />
          </div>
        </div>
      </div>
    </section>

    <!-- ── 6. CTA ──────────────────────────────────────────────────── -->
    <section class="relative py-28 overflow-hidden">
      <div class="spray spray-cyan absolute -top-32 left-1/3 w-96 h-96" />
      <div class="spray spray-pink absolute -bottom-32 right-1/3 w-96 h-96" />
      <div class="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div class="relative max-w-3xl mx-auto px-4 text-center" data-reveal>
        <svg width="40" height="56" viewBox="0 0 40 56" class="mx-auto mb-8 text-accent opacity-40" fill="none" aria-hidden="true">
          <path d="M20,4 C20,20 8,32 20,48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 4"/>
          <path d="M13,42 L20,50 L27,42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <Pill warm class="mb-6 mx-auto">Démarrez votre projet</Pill>
        <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.95] mb-6">
          Prêt à créer<br />
          <span class="text-accent">quelque chose ?</span>
        </h2>
        <p class="text-text-2 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Visualisez votre fresque en 2 secondes. Aucun engagement jusqu'à la demande de devis.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <RouterLink to="/configurateur">
            <BaseButton size="lg">Visualiser ma fresque →</BaseButton>
          </RouterLink>
          <RouterLink to="/portfolio">
            <BaseButton variant="secondary" size="lg">Voir le portfolio</BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Palette, Handshake, Leaf, ArrowRight } from 'lucide-vue-next'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Pill from '@/components/ui/Pill.vue'
import missionImage from '@/assets/blechesm-cover.jpg'

const pageEl = ref(null)

// ── Scroll reveal ────────────────────────────────────────────────
let observer = null
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target
          const delay = el.style.getPropertyValue('--delay') || '0s'
          el.style.transitionDelay = delay
          el.classList.add('is-visible')
          observer.unobserve(el)
        }
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  )
  pageEl.value?.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())

// ── Utilities ───────────────────────────────────────────────────
function hexAlpha(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

// ── Data ────────────────────────────────────────────────────────
const heroStats = [
  { value: '+200', label: 'Fresques réalisées', color: '#FB923C' },
  { value: '8 ans', label: "d'expérience",       color: '#4ADE80' },
  { value: '100%', label: 'Clients satisfaits',  color: '#22D3EE' },
]

const stickers = [
  { label: 'Art Mural',  color: '#FB923C', rotate: -3 },
  { label: 'Collectif',  color: '#4ADE80', rotate:  2 },
  { label: 'Graffiti',   color: '#F472B6', rotate: -2 },
  { label: 'Tunis 🇹🇳',  color: '#22D3EE', rotate:  3 },
  { label: 'Since 2016', color: '#A78BFA', rotate: -1 },
]

const milestones = [
  { year: '2016', event: 'Fondation du collectif à Tunis',               color: '#FB923C' },
  { year: '2018', event: 'Première fresque institutionnelle',             color: '#F472B6' },
  { year: '2020', event: 'Expansion au Maghreb & international',          color: '#22D3EE' },
  { year: '2022', event: "Lancement de l'outil IA",                       color: '#4ADE80' },
  { year: '2024', event: '+200 fresques réalisées en Tunisie & ailleurs', color: '#A78BFA' },
]

const artists = [
  {
    name: 'Alex Moreau',
    role: 'Co-fondateur & Artiste principal',
    bio: "Plus de 15 ans d'expérience dans le street art tunisien et international. Spécialisé en fresques monumentales et portraits hyperréalistes.",
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    color: '#FB923C',
    tag: 'Fresque',
    specialties: ['Monumental', 'Portraits', 'Hyperréalisme'],
  },
  {
    name: 'Léa Fontaine',
    role: 'Co-fondatrice & Directrice artistique',
    bio: "Ancienne graphiste, elle apporte une vision narrative unique à chaque projet. Experte en design et composition murale.",
    photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b7e5?w=400&q=80',
    color: '#F472B6',
    tag: 'Direction',
    specialties: ['Design', 'Composition', 'Identité visuelle'],
  },
  {
    name: 'Marcus D.',
    role: 'Artiste muraliste',
    bio: "Passionné par les formes géométriques et l'abstrait. A réalisé plus de 80 fresques en Tunisie et à l'international.",
    photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
    color: '#22D3EE',
    tag: 'Abstrait',
    specialties: ['Géométrique', 'Abstrait', 'Intérieur'],
  },
]

const values = [
  {
    icon: Palette,
    title: 'Artisanat',
    desc: "Chaque fresque est unique, réalisée à la main avec des matériaux professionnels durables et adaptés à l'environnement.",
    color: '#F472B6',
  },
  {
    icon: Handshake,
    title: 'Co-création',
    desc: "Vous êtes impliqué à chaque étape, de la visualisation IA à la réalisation finale. Votre vision guide notre art.",
    color: '#22D3EE',
  },
  {
    icon: Leaf,
    title: 'Durabilité',
    desc: "Peintures résistantes UV, écologiques et sans solvants, conçues pour durer 10 ans et plus sans décoloration.",
    color: '#4ADE80',
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
.spray-orange { background: #FF6B35; }
.spray-pink   { background: #F472B6; }
.spray-cyan   { background: #22D3EE; }
.spray-green  { background: #4ADE80; }
.spray-purple { background: #A78BFA; }

/* ── Grain overlay ──────────────────────────────────────────────── */
.grain-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: overlay;
  opacity: 0.5;
}

/* ── Hero animations (immediate on load) ────────────────────────── */
.h-eyebrow  { animation: fade-up 0.5s ease 0.05s both; }
.h-title    { animation: fade-up 0.65s ease 0.15s both; }
.h-sub      { animation: fade-up 0.55s ease 0.3s both; }
.h-stats    { animation: fade-up 0.5s ease 0.42s both; }
.h-stickers { animation: fade-left 0.7s ease 0.2s both; }

/* ── Stickers ───────────────────────────────────────────────────── */
.sticker {
  display: inline-block;
  padding: 5px 14px;
  border: 2px solid var(--sc);
  color: var(--sc);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
  background: rgba(0,0,0,0.25);
  animation: fade-left 0.5s ease both;
  transition: box-shadow 0.2s;
}
.sticker:hover { box-shadow: 0 0 16px color-mix(in srgb, var(--sc) 40%, transparent); }

/* ── Scroll reveal ──────────────────────────────────────────────── */
[data-reveal] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
[data-reveal].is-visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Timeline ───────────────────────────────────────────────────── */
.timeline-item {
  display: flex;
  flex-direction: column;
}
.timeline-dot {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.timeline-item:hover .timeline-dot { transform: scale(1.5); }
.timeline-item:hover p { color: var(--color-text) !important; }

/* ── Artist cards ───────────────────────────────────────────────── */
.artist-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.artist-card:hover {
  border-color: var(--ac);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.5);
}
.artist-topbar {
  height: 3px;
  background: var(--ac);
  transition: height 0.2s;
}
.artist-card:hover .artist-topbar { height: 5px; }
.artist-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.artist-card:hover .artist-photo { transform: scale(1.06); }

/* ── Value cards ────────────────────────────────────────────────── */
.value-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.value-card:hover {
  border-color: var(--vc);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.4);
}
.value-number {
  position: absolute;
  top: -18px;
  right: 8px;
  font-family: var(--font-display);
  font-size: 110px;
  font-weight: 800;
  color: var(--vc);
  opacity: 0.055;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.25s;
}
.value-card:hover .value-number { opacity: 0.09; }
.value-line {
  height: 3px;
  background: linear-gradient(to right, var(--vc), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.value-card:hover .value-line { opacity: 1; }

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-eyebrow, .h-title, .h-sub, .h-stats, .h-stickers, .sticker { animation: none; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .artist-photo, .artist-card, .value-card, .timeline-dot { transition: none; }
}
</style>
