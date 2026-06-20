<template>
  <div ref="pageEl" class="bg-bg text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div class="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
      <div class="spray spray-orange absolute -top-32 -right-32 w-[700px] h-[700px]" />
      <div class="spray spray-cyan   absolute top-1/2 -left-32 -translate-y-1/2 w-[500px] h-[500px]" />
      <div class="spray spray-pink   absolute -bottom-32 right-1/4 w-[450px] h-[450px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div class="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          <!-- Left: text -->
          <div>
            <div class="flex items-center gap-3 mb-6 hero-eyebrow">
              <Pill warm>Art Mural &amp; Graffiti Professionnel</Pill>
              <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
                <path d="M3,11 C11,4 28,4 40,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M34,6 L41,12 L33,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[0.9] mb-6 hero-title">
              Votre mur,<br />
              <span class="text-accent">votre fresque.</span><br />
              <span class="relative inline-block">
                Visualisé
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q33,0 66,4 Q100,8 133,4 Q166,0 200,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
              <br />avant de commencer.
            </h1>

            <p class="text-text-2 text-lg leading-relaxed mb-8 max-w-lg hero-sub">
              Uploadez une photo de votre mur, décrivez votre vision, et notre IA génère un aperçu en quelques secondes. Puis nos artistes la réalisent.
            </p>

            <div class="flex flex-wrap gap-3 mb-8 hero-cta">
              <RouterLink to="/configurateur">
                <BaseButton size="lg">Visualiser ma fresque →</BaseButton>
              </RouterLink>
              <RouterLink to="/portfolio">
                <BaseButton variant="secondary" size="lg">Voir le portfolio</BaseButton>
              </RouterLink>
            </div>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 hero-trust">
              <div v-for="(t, i) in miniTrust" :key="t.label" class="flex items-center gap-2">
                <div v-if="i > 0" class="w-1 h-1 rounded-full bg-border-strong" />
                <component :is="t.icon" class="w-3.5 h-3.5" :style="{ color: t.color }" />
                <span class="text-text-3 text-xs">{{ t.label }}</span>
              </div>
            </div>
          </div>

          <!-- Right: logo + image -->
          <div class="hero-image">
            <div class="flex items-center justify-center lg:justify-start mb-6">
              <img
                :src="logo"
                alt="Blechesm"
                class="h-20 sm:h-24 lg:h-28 w-auto object-contain"
                style="filter: drop-shadow(0 0 40px rgba(61,123,255,0.35)) drop-shadow(0 0 80px rgba(61,123,255,0.12))"
              />
            </div>

            <div class="relative">
              <div class="absolute -top-2.5 -left-2.5 w-full h-full rounded-xl border-2 border-warning/35 pointer-events-none z-0" />
              <div class="absolute -top-5 -left-5 w-full h-full rounded-xl border border-accent/15 pointer-events-none z-0" />

              <div class="relative aspect-[4/3] rounded-xl overflow-hidden border border-border-strong shadow-2xl shadow-black/70 z-10">
                <img :src="coverImage" alt="Exemple de fresque murale Blechesm" class="w-full h-full object-cover" />
                <div class="grain-overlay" />
                <div class="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-warning/5 pointer-events-none" />
              </div>

              <div class="absolute -bottom-4 -left-4 z-20 bg-surface-1 border border-border rounded-lg px-4 py-3 shadow-2xl">
                <p class="text-text-3 text-xs uppercase tracking-widest mb-0.5 font-mono">Généré en</p>
                <p class="font-display font-semibold text-text">2.5 secondes</p>
              </div>

              <div class="absolute -top-4 -right-4 z-20 bg-accent rounded-lg px-4 py-3 shadow-2xl">
                <p class="text-white text-xs font-semibold">+200 fresques réalisées</p>
              </div>

              <div class="absolute top-3 left-3 z-20 px-2 py-1 border-2 border-warning text-warning font-mono text-xs font-bold uppercase rounded tracking-widest"
                style="background: rgba(0,0,0,0.5); transform: rotate(-3deg);">IA</div>
            </div>
          </div>
        </div>
      </div>

      <div class="absolute bottom-0 left-0 right-0 leading-[0] pointer-events-none">
        <svg viewBox="0 0 1440 36" preserveAspectRatio="none" class="w-full h-9" aria-hidden="true">
          <path d="M0,0 L1440,0 L1440,12 Q1400,36 1360,12 Q1320,0 1280,20 Q1240,36 1200,16 Q1160,0 1120,18 Q1080,36 1040,16 Q1000,0 960,22 Q920,36 880,18 Q840,4 800,24 Q760,36 720,20 Q680,4 640,22 Q600,36 560,18 Q520,2 480,20 Q440,36 400,16 Q360,0 320,20 Q280,36 240,16 Q200,0 160,22 Q120,36 80,18 Q40,4 0,18 Z" fill="#080B14"/>
        </svg>
      </div>
    </section>

    <!-- ── TRUST BAND ─────────────────────────────────────────────────── -->
    <section class="border-b border-border bg-surface-1/40 overflow-hidden" data-reveal>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
        <div class="flex flex-wrap justify-center lg:justify-between items-center gap-6">
          <div
            v-for="(stat, i) in trustStats"
            :key="stat.label"
            class="flex items-center gap-5"
          >
            <div class="text-center sm:text-left">
              <p class="font-display text-2xl font-semibold tracking-tight" :style="{ color: stat.color }">{{ stat.value }}</p>
              <p class="text-text-3 text-xs mt-0.5">{{ stat.label }}</p>
            </div>
            <svg v-if="i < trustStats.length - 1" width="24" height="14" viewBox="0 0 24 14" class="text-border-strong shrink-0 hidden lg:block" fill="none" aria-hidden="true">
              <path d="M2,7 Q10,2 18,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M14,4 L19,7 L14,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PARTNERS MARQUEE ───────────────────────────────────────────── -->
    <section class="partners-section border-b border-border overflow-hidden" data-reveal>
      <!-- Header -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6 flex items-center gap-4">
        <span class="w-5 h-px bg-border-strong" />
        <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-text-3">Ils nous font confiance</p>
        <span class="flex-1 h-px bg-border" />
        <!-- Spray tag -->
        <span class="font-mono text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-accent/30 text-accent rounded"
          style="background: rgba(61,123,255,0.06); transform: rotate(1deg); display:inline-block">+{{ partners.length }} partenaires</span>
      </div>

      <!-- Scrolling strip -->
      <div class="marquee-wrap py-6 relative">
        <!-- Left fade -->
        <div class="marquee-fade marquee-fade--left" />
        <div class="marquee-fade marquee-fade--right" />

        <div class="marquee-track" aria-hidden="true">
          <!-- Duplicated twice for seamless loop -->
          <template v-for="pass in 2" :key="pass">
            <div
              v-for="p in partners"
              :key="`${pass}-${p.name}`"
              class="partner-item"
            >
              <img :src="p.logo" :alt="p.name" class="partner-logo-img" />
              <!-- Separator -->
              <svg width="20" height="12" viewBox="0 0 20 12" class="partner-sep" fill="none" aria-hidden="true">
                <path d="M2,6 Q9,1 16,6" stroke="white" stroke-width="1.2" stroke-linecap="round" opacity="0.2"/>
                <path d="M13,3 L17,6 L13,9" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
              </svg>
            </div>
          </template>
        </div>
      </div>
    </section>

    <!-- ── COMMENT ÇA MARCHE ─────────────────────────────────────────── -->
    <section class="relative py-28 overflow-hidden">
      <div class="spray spray-purple absolute -top-32 -left-32 w-[500px] h-[500px]" />
      <div class="spray spray-green  absolute -bottom-32 -right-32 w-[400px] h-[400px]" />
      <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-16 flex items-end justify-between gap-8" data-reveal>
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Comment ça marche</span>
            </div>
            <h2 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest leading-[0.95]">
              De votre mur<br />à l'<span class="text-accent">œuvre d'art</span>
            </h2>
          </div>
          <svg width="80" height="48" viewBox="0 0 80 48" class="text-warning opacity-45 hidden md:block shrink-0 mb-2" fill="none" aria-hidden="true">
            <path d="M4,12 C20,4 60,20 72,36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M64,30 L74,38 L64,44" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <div class="relative">
          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div
              v-for="(step, i) in steps"
              :key="i"
              class="step-card"
              :style="{ '--sc': step.color, '--delay': `${i * 0.1}s` }"
              data-reveal
            >
              <div class="step-ghost-num">{{ String(i + 1).padStart(2, '0') }}</div>
              <div class="relative z-10">
                <p class="font-mono text-xs font-bold tracking-widest mb-4" :style="{ color: step.color }">
                  {{ String(i + 1).padStart(2, '0') }}
                </p>
                <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  :style="{ background: hexAlpha(step.color, 0.14), color: step.color }"
                >
                  <component :is="step.icon" class="w-6 h-6" />
                </div>
                <h3 class="font-display font-semibold text-text text-lg mb-2 leading-tight">{{ step.title }}</h3>
                <p class="text-text-2 text-sm leading-relaxed">{{ step.desc }}</p>
              </div>
              <div class="step-line" />
            </div>
          </div>

          <div class="absolute top-16 left-0 right-0 pointer-events-none hidden lg:flex items-center justify-around px-[calc(25%-24px)]" aria-hidden="true">
            <svg v-for="n in 3" :key="n" width="32" height="16" viewBox="0 0 32 16" class="text-border-strong" fill="none">
              <path d="M2,8 Q14,3 26,8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M21,5 L27,8 L21,11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ── PORTFOLIO PREVIEW ──────────────────────────────────────────── -->
    <section class="relative py-24 overflow-hidden">
      <div class="spray spray-orange absolute top-0 right-0 -translate-y-1/2 w-[400px] h-[400px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10" data-reveal>
          <div>
            <div class="flex items-center gap-3 mb-4">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Nos réalisations</span>
            </div>
            <h2 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest leading-[0.95]">
              Quelques fresques<br /><span class="text-accent">récentes</span>
            </h2>
          </div>
          <RouterLink to="/portfolio" class="shrink-0 mb-1">
            <BaseButton variant="ghost" size="md">
              Tout voir
              <ArrowRight class="w-4 h-4" />
            </BaseButton>
          </RouterLink>
        </div>

        <div class="preview-grid">
          <div
            v-for="(item, i) in portfolioPreview"
            :key="item.id"
            class="preview-card"
            :class="i === 0 ? 'preview-card--featured' : ''"
            :style="{
              '--pc': tagColor(item.style),
              '--pc-bg': hexAlpha(tagColor(item.style), 0.14),
              '--delay': `${i * 0.09}s`,
            }"
            data-reveal
          >
            <div class="preview-topbar" />
            <div class="preview-img-wrap">
              <img :src="item.image" :alt="item.title" class="preview-img" loading="lazy" />
              <div class="grain-overlay" />
            </div>
            <div class="preview-overlay" aria-hidden="true">
              <div class="preview-overlay-inner">
                <p class="text-white font-display font-semibold text-base leading-tight">{{ item.title }}</p>
                <p class="text-white/60 text-xs mt-1">{{ item.city }} · {{ item.size }}</p>
                <div class="preview-arrow-btn">
                  <ArrowRight class="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

          <RouterLink to="/portfolio" class="preview-cta-card">
            <svg width="36" height="36" viewBox="0 0 36 36" class="text-accent mb-3" fill="none" aria-hidden="true">
              <circle cx="18" cy="18" r="17" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
              <path d="M12,18 Q18,12 24,18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <path d="M20,15 L25,18 L20,21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <p class="font-display font-semibold text-text text-sm mb-1">Voir tout<br />le portfolio</p>
            <p class="text-text-3 text-xs">+{{ portfolioData.length }} réalisations</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- ── SOCIAL PROOF ───────────────────────────────────────────────── -->
    <section class="relative py-20 overflow-hidden border-y border-border">
      <div class="absolute inset-0 bg-surface-1/30 pointer-events-none" />
      <div class="absolute inset-0 grid-bg opacity-8 pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="testimonial-card"
            :style="{ '--tc': t.color, '--delay': `${i * 0.1}s` }"
            data-reveal
          >
            <div class="flex items-center gap-1 mb-4">
              <span v-for="n in 5" :key="n" class="text-warning text-sm">★</span>
            </div>
            <blockquote class="text-text-2 text-sm leading-relaxed mb-5 flex-1">
              "{{ t.quote }}"
            </blockquote>
            <div class="flex items-center gap-3 pt-4 border-t border-border">
              <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                :style="{ background: hexAlpha(t.color, 0.2), color: t.color }"
              >{{ t.initials }}</div>
              <div>
                <p class="text-text font-semibold text-sm">{{ t.name }}</p>
                <p class="text-text-3 text-xs">{{ t.role }}</p>
              </div>
            </div>
          </div>

          <div class="statement-card sm:col-span-2 lg:col-span-1" data-reveal style="--delay: 0.25s">
            <div class="spray spray-accent absolute inset-0 rounded-xl opacity-[0.08]" style="filter:blur(40px)" />
            <div class="relative z-10 h-full flex flex-col justify-between">
              <div>
                <p class="font-mono text-xs uppercase tracking-widest text-accent mb-4">Notre engagement</p>
                <p class="font-display text-2xl font-semibold tracking-tight text-text leading-tight">
                  Chaque fresque est une signature durable sur votre espace.
                </p>
              </div>
              <div class="mt-8 flex flex-wrap gap-2">
                <span v-for="badge in statBadges" :key="badge.label"
                  class="text-xs px-3 py-1.5 rounded-pill font-semibold border"
                  :style="{ color: badge.color, borderColor: hexAlpha(badge.color, 0.4), background: hexAlpha(badge.color, 0.1) }"
                >{{ badge.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── CTA FINAL ──────────────────────────────────────────────────── -->
    <section class="relative py-32 overflow-hidden">
      <div class="spray spray-green  absolute -top-32 left-1/4   w-[500px] h-[500px]" />
      <div class="spray spray-orange absolute -bottom-32 right-1/4 w-[500px] h-[500px]" />
      <div class="spray spray-cyan   absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px]" />
      <div class="absolute inset-0 grid-bg opacity-25 pointer-events-none" />

      <div class="relative max-w-3xl mx-auto px-4 text-center" data-reveal>
        <svg width="40" height="56" viewBox="0 0 40 56" class="mx-auto mb-10 text-accent opacity-40" fill="none" aria-hidden="true">
          <path d="M20,4 C20,20 8,32 20,48" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="3 4"/>
          <path d="M13,42 L20,50 L27,42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>

        <Pill warm class="mb-6 mx-auto">Passez à l'action</Pill>
        <h2 class="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[0.9] mb-6">
          Votre mur mérite<br />
          <span class="text-accent">d'être une œuvre.</span>
        </h2>
        <p class="text-text-2 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          Testez notre outil de visualisation gratuitement. Aucun engagement jusqu'à la demande de devis.
        </p>
        <div class="flex flex-wrap gap-3 justify-center">
          <RouterLink to="/configurateur">
            <BaseButton size="lg">Commencer la visualisation →</BaseButton>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { Camera, PenLine, Sparkles, Handshake, ArrowRight, Zap, Shield, Gift } from 'lucide-vue-next'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import Pill from '@/components/ui/Pill.vue'
import { portfolioData } from '@/mocks/data.js'
import coverImage from '@/assets/blechesm-cover.jpg'
import logo from '@/assets/logo.png'
import ooredooUrl        from '@/assets/partners/ooredoo.svg'
import tunisieTelecomUrl from '@/assets/partners/tunisie-telecom.svg'
import biatUrl           from '@/assets/partners/biat.svg'
import tunisairUrl       from '@/assets/partners/tunisair.svg'
import poulinaUrl        from '@/assets/partners/poulina.svg'
import deliceUrl         from '@/assets/partners/delice.svg'
import ennaklUrl        from '@/assets/partners/ennakl.svg'
import attijariUrl       from '@/assets/partners/attijari.svg'
import monoprixUrl       from '@/assets/partners/monoprix.svg'
import stbUrl            from '@/assets/partners/stb.svg'

const pageEl = ref(null)
const portfolioPreview = portfolioData.slice(0, 4)

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
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

const TAG_COLORS = {
  nature: '#4ADE80', abstrait: '#A78BFA', figuratif: '#F472B6',
  lettrage: '#FB923C', 'sci-fi': '#22D3EE', couleur: '#FBBF24',
}
function tagColor(tag) { return TAG_COLORS[tag] ?? '#3D7BFF' }

// ── Data ────────────────────────────────────────────────────────
const partners = [
  { name: 'Ooredoo',          logo: ooredooUrl },
  { name: 'Tunisie Telecom',  logo: tunisieTelecomUrl },
  { name: 'BIAT',             logo: biatUrl },
  { name: 'Tunisair',         logo: tunisairUrl },
  { name: 'Poulina',          logo: poulinaUrl },
  { name: 'Délice',           logo: deliceUrl },
  { name: 'Ennakl',           logo: ennaklUrl },
  { name: 'Attijari Bank',    logo: attijariUrl },
  { name: 'Monoprix',         logo: monoprixUrl },
  { name: 'STB',              logo: stbUrl },
]

const miniTrust = [
  { icon: Zap,    label: 'Génération IA en 2s',    color: '#FBBF24' },
  { icon: Gift,   label: 'Visualisation gratuite',  color: '#4ADE80' },
  { icon: Shield, label: 'Sans engagement',         color: '#22D3EE' },
]

const trustStats = [
  { value: '+200', label: 'Fresques réalisées', color: '#FB923C' },
  { value: '8 ans', label: "d'expérience",      color: '#4ADE80' },
  { value: '100%', label: 'Clients satisfaits', color: '#22D3EE' },
  { value: 'Tunisie', label: "Zone d'intervention", color: '#F472B6' },
]

const steps = [
  { icon: Camera,    title: 'Uploadez votre mur',     desc: 'Prenez une photo de votre mur et importez-la dans notre configurateur.', color: '#FB923C' },
  { icon: PenLine,   title: 'Décrivez votre vision',  desc: 'Style, couleurs, références — guidez notre IA avec vos idées.',          color: '#F472B6' },
  { icon: Sparkles,  title: 'Visualisez le résultat', desc: 'Notre IA génère un aperçu réaliste de la fresque sur votre mur.',        color: '#3D7BFF' },
  { icon: Handshake, title: 'Demandez un devis',      desc: 'Nos artistes réalisent la fresque de vos rêves sur place.',              color: '#4ADE80' },
]

const testimonials = [
  {
    quote: "Blechesm a transformé la façade de notre restaurant en véritable œuvre d'art. La visualisation IA nous a permis de valider le projet avant même le premier coup de pinceau.",
    name: 'Arnaud Petit',
    role: 'Gérant, Resto Le Midi — Marseille',
    initials: 'AP',
    color: '#FB923C',
  },
  {
    quote: "Un travail exceptionnel pour notre gymnase municipal. L'équipe a été professionnelle du début à la fin, et le rendu dépasse toutes nos attentes.",
    name: 'Camille Leroy',
    role: 'Mairie de Nantes',
    initials: 'CL',
    color: '#22D3EE',
  },
]

const statBadges = [
  { label: '+200 fresques',    color: '#FB923C' },
  { label: 'Peintures UV',     color: '#4ADE80' },
  { label: 'Eco-responsable',  color: '#22D3EE' },
  { label: 'Garantie 10 ans',  color: '#A78BFA' },
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
.spray-orange { background: #FF6B35; }
.spray-pink   { background: #F472B6; }
.spray-cyan   { background: #22D3EE; }
.spray-green  { background: #4ADE80; }
.spray-purple { background: #A78BFA; }
.spray-accent { background: #3D7BFF; }

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
.hero-eyebrow { animation: fade-up 0.5s ease 0.05s both; }
.hero-title   { animation: fade-up 0.7s ease 0.2s both; }
.hero-sub     { animation: fade-up 0.6s ease 0.38s both; }
.hero-cta     { animation: fade-up 0.5s ease 0.52s both; }
.hero-trust   { animation: fade-up 0.5s ease 0.64s both; }
.hero-image   { animation: fade-left 0.8s ease 0.3s both; }

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

/* ── Partners marquee ───────────────────────────────────────────── */
.partners-section {
  background: var(--color-surface-1);
}
.marquee-wrap {
  position: relative;
  overflow: hidden;
}
.marquee-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 120px;
  z-index: 2;
  pointer-events: none;
}
.marquee-fade--left {
  left: 0;
  background: linear-gradient(to right, var(--color-surface-1), transparent);
}
.marquee-fade--right {
  right: 0;
  background: linear-gradient(to left, var(--color-surface-1), transparent);
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

.partner-item {
  display: inline-flex;
  align-items: center;
  gap: 20px;
  padding: 0 32px;
  white-space: nowrap;
  opacity: 0.4;
  transition: opacity 0.25s;
  cursor: default;
}
.partner-item:hover { opacity: 0.85; }
.partner-logo-img {
  height: 32px;
  width: auto;
  object-fit: contain;
  display: block;
  filter: brightness(0) invert(1);
}
.partner-sep {
  flex-shrink: 0;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Step cards ─────────────────────────────────────────────────── */
.step-card {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px 24px 24px;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
}
.step-card:hover {
  border-color: var(--sc);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.5);
}
.step-ghost-num {
  position: absolute;
  top: -16px;
  right: 8px;
  font-family: var(--font-display);
  font-size: 96px;
  font-weight: 800;
  color: var(--sc);
  opacity: 0.055;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  transition: opacity 0.25s;
}
.step-card:hover .step-ghost-num { opacity: 0.1; }
.step-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(to right, var(--sc), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}
.step-card:hover .step-line { opacity: 1; }

/* ── Portfolio preview grid ─────────────────────────────────────── */
.preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 240px;
  gap: 16px;
}
@media (max-width: 768px) {
  .preview-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 200px; }
}
@media (max-width: 480px) {
  .preview-grid { grid-template-columns: 1fr; grid-auto-rows: 220px; }
}
.preview-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  cursor: pointer;
}
.preview-card:hover {
  border-color: var(--pc);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px -8px rgba(0,0,0,0.6);
}
.preview-card--featured { grid-column: span 2; }
@media (max-width: 480px) { .preview-card--featured { grid-column: span 1; } }
.preview-topbar {
  height: 3px;
  background: var(--pc);
  flex-shrink: 0;
  transition: height 0.2s;
}
.preview-card:hover .preview-topbar { height: 5px; }
.preview-img-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--color-surface-2);
}
.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.preview-card:hover .preview-img { transform: scale(1.07); }
.preview-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(4,6,18,0.9) 0%, transparent 60%);
  display: flex;
  align-items: flex-end;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 16px;
}
.preview-card:hover .preview-overlay { opacity: 1; }
.preview-overlay-inner {
  width: 100%;
  transform: translateY(8px);
  transition: transform 0.3s ease;
}
.preview-card:hover .preview-overlay-inner { transform: translateY(0); }
.preview-arrow-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid var(--pc);
  background: var(--pc-bg);
  color: var(--pc);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  transform: translateX(-8px);
  opacity: 0;
  transition: transform 0.3s ease 0.05s, opacity 0.3s ease 0.05s;
}
.preview-card:hover .preview-arrow-btn { transform: translateX(0); opacity: 1; }
.preview-cta-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: 10px;
  border: 1.5px dashed var(--color-border-strong);
  background: var(--color-surface-1);
  padding: 16px;
  transition: border-color 0.2s, background 0.2s;
  text-decoration: none;
}
.preview-cta-card:hover {
  border-color: var(--color-accent);
  background: rgba(61,123,255,0.05);
}

/* ── Testimonials ───────────────────────────────────────────────── */
.testimonial-card {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--tc);
  border-radius: 12px;
  padding: 24px;
  transition: border-color 0.25s, transform 0.25s;
}
.testimonial-card:hover {
  border-color: var(--tc);
  transform: translateY(-3px);
}
.statement-card {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 28px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(32px) scale(0.97); }
  to   { opacity: 1; transform: translateX(0) scale(1); }
}

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero-eyebrow, .hero-title, .hero-sub, .hero-cta, .hero-trust, .hero-image { animation: none; }
  [data-reveal] { opacity: 1; transform: none; transition: none; }
  .marquee-track { animation: none; }
  .preview-img, .preview-overlay, .preview-overlay-inner,
  .preview-arrow-btn, .step-line, .step-ghost-num,
  .preview-card, .step-card, .testimonial-card { transition: none; }
}
</style>
