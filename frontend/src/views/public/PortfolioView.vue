<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-28 overflow-hidden">
      <div class="absolute inset-0 grid-bg opacity-15 pointer-events-none" />

      <!-- Spray paint atmosphere -->
      <div class="spray spray-orange absolute -top-32 -right-32 w-[600px] h-[600px]" />
      <div class="spray spray-pink absolute -bottom-32 -left-32 w-[500px] h-[500px]" />
      <div class="spray spray-cyan absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-start justify-between gap-12">

          <!-- Left -->
          <div class="max-w-2xl">
            <!-- Eyebrow + arrow -->
            <div class="flex items-center gap-3 mb-6 hero-eyebrow">
              <div class="flex items-center gap-2">
                <span class="w-6 h-px bg-accent" />
                <span class="text-xs font-mono uppercase tracking-widest text-accent">Portfolio</span>
              </div>
              <svg width="56" height="24" viewBox="0 0 56 24" class="text-warning opacity-70 hidden sm:block"
                fill="none" aria-hidden="true">
                <path d="M4,12 C14,4 32,4 46,12" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                <path d="M40,7 L47,13 L39,17" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>

            <h1
              class="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[0.9] mb-6 hero-title">
              Nos<br />
              <span class="relative inline-block text-accent">
                réalisations
                <!-- Graffiti wavy underline -->
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 320 8" preserveAspectRatio="none"
                  fill="none" aria-hidden="true">
                  <path d="M0,4 Q40,0 80,4 Q120,8 160,4 Q200,0 240,4 Q280,8 320,4" stroke="#FF6B35" stroke-width="3.5"
                    stroke-linecap="round" opacity="0.65" />
                </svg>
              </span>
            </h1>

            <p class="text-text-2 text-lg leading-relaxed mb-10 max-w-xl hero-sub">
              Fresques murales, graffitis artistiques et installations visuelles —
              découvrez l'étendue de notre travail à travers toute la Tunisie.
            </p>

            <!-- Stats row -->
            <div class="flex flex-wrap gap-10 hero-stats">
              <div v-for="stat in heroStats" :key="stat.label">
                <p class="font-display text-3xl font-semibold" :style="{ color: stat.color }">{{ stat.value }}</p>
                <p class="text-text-3 text-xs mt-0.5 tracking-wide">{{ stat.label }}</p>
              </div>
            </div>
          </div>

          <!-- Right: sticker tags (desktop only) -->
          <div class="hidden lg:flex flex-col items-end gap-3 pt-12 hero-stickers shrink-0">
            <!-- Dashed vertical arrow -->
            <svg width="28" height="64" viewBox="0 0 28 64" class="text-text-3 opacity-50 mb-1" fill="none"
              aria-hidden="true">
              <path d="M14,4 C14,22 6,36 14,56" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-dasharray="3 4" />
              <path d="M8,50 L14,58 L20,50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <div v-for="(s, i) in styleStickers" :key="s.label" class="sticker"
              :style="{ '--sc': s.color, transform: `rotate(${s.rotate}deg)`, animationDelay: `${0.3 + i * 0.08}s` }">
              {{ s.label }}
            </div>
          </div>

        </div>
      </div>

    </section>

    <!-- ── FILTER BAR (sticky) ──────────────────────────────────────── -->
    <div class="sticky top-[64px] z-30 bg-bg/95 backdrop-blur-md border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-3 py-4 overflow-x-auto no-scrollbar">
          <!-- Mini arrow -->
          <div class="hidden sm:flex items-center gap-1.5 shrink-0 mr-1 text-text-3">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M2,7 Q8,2 14,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              <path d="M11,4 L15,7 L11,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <span class="text-xs font-mono">Filtrer</span>
          </div>
          <div class="w-px h-5 bg-border shrink-0 hidden sm:block" />

          <button v-for="tag in allTags" :key="tag" @click="setFilter(tag)" class="filter-pill shrink-0" :style="activeTag === tag ? {
            color: tagColor(tag),
            borderColor: tagColor(tag),
            background: hexAlpha(tagColor(tag), 0.14),
          } : {}">
            <span v-if="activeTag === tag" class="inline-block w-1.5 h-1.5 rounded-full mr-1.5 shrink-0"
              :style="{ background: tagColor(tag) }" />
            {{ tag === 'all' ? 'Tout voir' : tag }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── PORTFOLIO GRID ───────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div v-if="filteredItems.length > 0" class="portfolio-grid">
        <article v-for="(item, i) in filteredItems" :key="`${filterVersion}-${item.id}`" class="portfolio-card"
          :class="i === 0 && activeTag === 'all' ? 'portfolio-card--featured' : ''" :style="{
            '--ca': tagColor(item.style),
            '--ca-bg': hexAlpha(tagColor(item.style), 0.14),
            animationDelay: `${Math.min(i * 0.07, 0.56)}s`,
          }">
          <!-- Colored top bar -->
          <div class="card-topbar" />

          <!-- Image -->
          <div class="card-img-wrap">
            <img :src="item.image" :alt="item.title" class="card-img" loading="lazy" />
            <!-- Spray grain overlay -->
            <div class="card-grain" />
          </div>

          <!-- Always-visible footer -->
          <div class="card-footer">
            <div>
              <p class="card-name">{{ item.title }}</p>
              <p class="card-location">{{ item.city }} · {{ item.size }}</p>
            </div>
            <span class="card-badge" :style="{
              color: tagColor(item.style),
              borderColor: hexAlpha(tagColor(item.style), 0.5),
              background: hexAlpha(tagColor(item.style), 0.12),
            }">{{ item.style }}</span>
          </div>

          <!-- Hover overlay -->
          <div class="card-overlay" aria-hidden="true">
            <div class="card-overlay-inner">
              <p class="ov-year">{{ item.year }}</p>
              <p class="ov-title">{{ item.title }}</p>
              <p class="ov-loc">{{ item.city }} · {{ item.size }}</p>
              <p class="ov-desc">{{ item.description }}</p>
              <div class="ov-bottom">
                <div class="ov-tags">
                  <span v-for="t in item.tags.slice(0, 2)" :key="t" class="ov-tag">{{ t }}</span>
                </div>
                <!-- Arrow CTA -->
                <div class="ov-arrow">
                  <ArrowRight class="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-24">
        <p class="text-text-3 text-sm mb-3">Aucune réalisation pour ce filtre.</p>
        <button @click="setFilter('all')" class="text-accent text-sm hover:underline">Tout afficher →</button>
      </div>
    </main>

    <!-- ── CTA ─────────────────────────────────────────────────────── -->
    <section class="relative py-28 overflow-hidden">
      <div class="spray spray-green absolute -top-32 right-1/4 w-96 h-96 pointer-events-none" />
      <div class="spray spray-orange absolute -bottom-32 left-1/4 w-96 h-96 pointer-events-none" />
      <div class="absolute inset-0 grid-bg opacity-25 pointer-events-none" />
      <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />

      <div class="relative max-w-3xl mx-auto px-4 text-center cta-content">
        <!-- Curved arrow pointing down -->
        <svg width="40" height="56" viewBox="0 0 40 56" class="mx-auto mb-8 text-accent opacity-40" fill="none"
          aria-hidden="true">
          <path d="M20,4 C20,20 8,32 20,48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            stroke-dasharray="3 4" />
          <path d="M13,42 L20,50 L27,42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>

        <Pill warm class="mb-6 mx-auto">Votre projet</Pill>
        <h2 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.95] mb-6">
          Prêt à créer<br />
          <span class="text-accent">votre fresque ?</span>
        </h2>
        <p class="text-text-2 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
          Testez notre visualiseur IA gratuitement. Uploadez une photo de votre mur et voyez le résultat en 2 secondes.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <RouterLink to="/configurateur">
            <BaseButton size="lg">Visualiser ma fresque →</BaseButton>
          </RouterLink>
          <RouterLink to="/contact">
            <BaseButton variant="secondary" size="lg">Nous contacter</BaseButton>
          </RouterLink>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import { portfolioData } from '@/mocks/data.js'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Pill from '@/components/ui/Pill.vue'

const items = portfolioData
const activeTag = ref('all')
const filterVersion = ref(0)

const allTags = computed(() => {
  const tags = new Set(['all'])
  items.forEach(i => i.tags.forEach(t => tags.add(t)))
  return [...tags]
})

const filteredItems = computed(() =>
  activeTag.value === 'all' ? items : items.filter(i => i.tags.includes(activeTag.value))
)

function setFilter(tag) {
  activeTag.value = tag
  filterVersion.value++
}

/* Convert hex + alpha to rgba string (for inline dynamic colors) */
function hexAlpha(hex, a) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${a})`
}

const TAG_COLORS = {
  all: '#3D7BFF',
  nature: '#4ADE80',
  abstrait: '#A78BFA',
  figuratif: '#F472B6',
  lettrage: '#FB923C',
  'sci-fi': '#22D3EE',
  couleur: '#FBBF24',
  géométrique: '#2DD4BF',
  portraits: '#FB7185',
  méditerranée: '#38BDF8',
  street: '#A3E635',
  enfants: '#FDE047',
  musique: '#818CF8',
  sport: '#F87171',
  urbain: '#EF4444',
  biomécanique: '#22D3EE',
  typographie: '#FB923C',
  intérieur: '#8B5CF6',
  extérieur: '#22C55E',
}
function tagColor(tag) { return TAG_COLORS[tag] ?? '#3D7BFF' }

const heroStats = [
  { value: '+200', label: 'Fresques réalisées', color: '#FB923C' },
  { value: '8 ans', label: "d'expérience", color: '#4ADE80' },
  { value: '12+', label: 'Villes en Tunisie', color: '#22D3EE' },
]

const styleStickers = [
  { label: 'Street Art', color: '#FB923C', rotate: -4 },
  { label: 'Graffiti', color: '#4ADE80', rotate: 2 },
  { label: 'Lettrage', color: '#F472B6', rotate: -2 },
  { label: 'Fresque Murale', color: '#22D3EE', rotate: 3 },
  { label: 'Art Mural', color: '#A78BFA', rotate: -1 },
]
</script>

<style scoped>
/* ── Scrollbar hide ─────────────────────────────────────────────── */
.no-scrollbar {
  scrollbar-width: none;
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* ── Spray blobs ────────────────────────────────────────────────── */
.spray {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.07;
  pointer-events: none;
}

.spray-orange {
  background: #FF6B35;
}

.spray-pink {
  background: #F472B6;
}

.spray-cyan {
  background: #22D3EE;
}

.spray-green {
  background: #4ADE80;
}

/* ── Hero animations ────────────────────────────────────────────── */
.hero-eyebrow {
  animation: fade-up 0.5s ease 0.05s both;
}

.hero-title {
  animation: fade-up 0.65s ease 0.15s both;
}

.hero-sub {
  animation: fade-up 0.55s ease 0.3s both;
}

.hero-stats {
  animation: fade-up 0.5s ease 0.42s both;
}

.hero-stickers {
  animation: fade-left 0.7s ease 0.2s both;
}

/* ── Sticker tags ───────────────────────────────────────────────── */
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
  animation: fade-left 0.5s ease both;
  /* subtle background tint */
  background: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3), inset 0 0 0 0px var(--sc);
  transition: box-shadow 0.2s;
}

.sticker:hover {
  box-shadow: 0 0 18px rgba(0, 0, 0, 0.4), inset 0 0 0 1px var(--sc);
}

/* ── Filter pills ───────────────────────────────────────────────── */
.filter-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid var(--color-border);
  background: var(--color-surface-1);
  color: var(--color-text-2);
  cursor: pointer;
  transition: border-color 0.18s, color 0.18s, background 0.18s;
  white-space: nowrap;
  min-height: 36px;
}

.filter-pill:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

/* ── Grid ───────────────────────────────────────────────────────── */
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 260px;
  gap: 18px;
}

@media (max-width: 1024px) {
  .portfolio-grid {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 240px;
  }
}

@media (max-width: 640px) {
  .portfolio-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 300px;
  }
}

/* ── Card ───────────────────────────────────────────────────────── */
.portfolio-card {
  position: relative;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  animation: card-in 0.45s ease both;
  transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease;
}

.portfolio-card:hover {
  border-color: var(--ca);
  box-shadow:
    0 0 0 1px var(--ca-bg),
    0 12px 40px -8px rgba(0, 0, 0, 0.6);
  transform: translateY(-3px);
}

/* Featured: 2 cols × 2 rows */
.portfolio-card--featured {
  grid-column: span 2;
  grid-row: span 2;
}

@media (max-width: 640px) {
  .portfolio-card--featured {
    grid-column: span 1;
    grid-row: span 1;
  }
}

/* Top accent bar */
.card-topbar {
  height: 3px;
  background: var(--ca);
  flex-shrink: 0;
  transition: height 0.2s ease;
}

.portfolio-card:hover .card-topbar {
  height: 5px;
}

/* Image */
.card-img-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface-2);
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}

.portfolio-card:hover .card-img {
  transform: scale(1.07);
}

/* Grain / texture overlay */
.card-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
  pointer-events: none;
  opacity: 0.5;
  mix-blend-mode: overlay;
}

/* Footer info */
.card-footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-surface-1);
  border-top: 1px solid var(--color-border);
}

.card-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 13px;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-location {
  font-size: 11px;
  color: var(--color-text-3);
  margin-top: 1px;
}

.card-badge {
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

/* ── Hover overlay ──────────────────────────────────────────────── */
.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top,
      rgba(4, 6, 18, 0.96) 0%,
      rgba(4, 6, 18, 0.7) 45%,
      rgba(4, 6, 18, 0.1) 100%);
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 20px;
}

.portfolio-card:hover .card-overlay {
  opacity: 1;
}

.card-overlay-inner {
  width: 100%;
  transform: translateY(10px);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.portfolio-card:hover .card-overlay-inner {
  transform: translateY(0);
}

.ov-year {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--ca);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 4px;
}

.ov-title {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 2px;
  line-height: 1.2;
}

.portfolio-card--featured .ov-title {
  font-size: 24px;
}

.ov-loc {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 8px;
}

.ov-desc {
  font-size: 12px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.portfolio-card--featured .ov-desc {
  -webkit-line-clamp: 3;
}

.ov-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.ov-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.ov-tag {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  color: rgba(255, 255, 255, 0.75);
  background: rgba(255, 255, 255, 0.08);
}

/* Colored arrow button */
.ov-arrow {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1.5px solid var(--ca);
  color: var(--ca);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transform: translateX(-10px);
  opacity: 0;
  transition: transform 0.3s ease 0.08s, opacity 0.3s ease 0.08s;
  background: var(--ca-bg);
}

.portfolio-card:hover .ov-arrow {
  transform: translateX(0);
  opacity: 1;
}

/* ── CTA section ────────────────────────────────────────────────── */
.cta-content {
  animation: fade-up 0.6s ease both;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(22px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-left {
  from {
    opacity: 0;
    transform: translateX(24px);
  }

  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {

  .portfolio-card,
  .hero-eyebrow,
  .hero-title,
  .hero-sub,
  .hero-stats,
  .hero-stickers,
  .sticker,
  .cta-content {
    animation: none;
  }

  .card-img,
  .card-overlay,
  .card-overlay-inner,
  .ov-arrow,
  .card-topbar,
  .portfolio-card {
    transition: none;
  }
}
</style>
