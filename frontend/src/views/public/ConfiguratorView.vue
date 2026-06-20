<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-20 overflow-hidden">
      <div class="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
      <div class="spray spray-orange absolute -top-24 -right-24 w-[480px] h-[480px]" />
      <div class="spray spray-cyan   absolute -bottom-24 -left-24 w-[360px] h-[360px]" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Breadcrumb -->
        <nav class="flex items-center gap-1.5 mb-8 text-xs text-text-3 h-eyebrow">
          <RouterLink to="/" class="hover:text-text transition-colors">Accueil</RouterLink>
          <ChevronRight class="w-3 h-3" />
          <span class="text-accent font-medium">Configurateur</span>
        </nav>

        <div class="flex items-start justify-between gap-8">
          <div class="max-w-2xl">
            <!-- Eyebrow -->
            <div class="flex items-center gap-3 mb-5 h-eyebrow2">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Outil de visualisation IA</span>
              <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
                <path d="M3,11 C12,4 30,4 42,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M35,6 L43,12 L35,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.92] mb-5 h-title">
              Décrivez votre mur,<br />
              <span class="relative inline-block text-accent">
                recevez votre devis.
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
            </h1>

            <p class="text-text-2 text-base leading-relaxed mb-8 max-w-lg h-sub">
              Uploadez la photo de votre mur, décrivez votre vision. Notre IA génère un aperçu en 2 secondes — puis nos artistes vous envoient un devis personnalisé.
            </p>

            <!-- 3-step funnel -->
            <div class="flex items-center gap-0 h-funnel">
              <div v-for="(step, i) in funnelSteps" :key="i" class="flex items-center">
                <div class="funnel-step" :style="{ '--fs': step.color }"
                  :class="i === 0 ? 'funnel-step--active' : ''">
                  <span class="funnel-num">{{ String(i+1).padStart(2,'0') }}</span>
                  <span class="funnel-label">{{ step.label }}</span>
                </div>
                <svg v-if="i < funnelSteps.length - 1" width="28" height="14" viewBox="0 0 28 14" class="shrink-0 text-text-3 opacity-40 mx-1" fill="none">
                  <path d="M2,7 Q12,2 22,7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  <path d="M18,4 L23,7 L18,10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Desktop stickers -->
          <div class="hidden lg:flex flex-col items-end gap-3 pt-8 shrink-0 h-stickers">
            <div v-for="(s, i) in stickers" :key="s.label"
              class="sticker" :style="{ '--sc': s.color, transform: `rotate(${s.rotate}deg)`, animationDelay: `${0.3 + i * 0.1}s` }">
              {{ s.label }}
            </div>
          </div>
        </div>
      </div>

      <!-- Drip -->
      <div class="absolute bottom-0 left-0 right-0 leading-[0] pointer-events-none">
        <svg viewBox="0 0 1440 36" preserveAspectRatio="none" class="w-full h-9" aria-hidden="true">
          <path d="M0,0 L1440,0 L1440,12 Q1400,36 1360,12 Q1320,0 1280,20 Q1240,36 1200,16 Q1160,0 1120,18 Q1080,36 1040,16 Q1000,0 960,22 Q920,36 880,18 Q840,4 800,24 Q760,36 720,20 Q680,4 640,22 Q600,36 560,18 Q520,2 480,20 Q440,36 400,16 Q360,0 320,20 Q280,36 240,16 Q200,0 160,22 Q120,36 80,18 Q40,4 0,18 Z" fill="#080B14"/>
        </svg>
      </div>
    </section>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

        <!-- ── LEFT: FORM ─────────────────────────────────────────── -->
        <div class="lg:col-span-3 space-y-4">
          <form @submit.prevent="handleGenerate" novalidate>

            <!-- Step 1 — Wall photo -->
            <div class="config-card" :class="store.wallPhoto ? 'config-card--done' : ''" style="--cc: #FB923C">
              <div class="config-accent" />
              <div class="flex items-start gap-4 mb-5">
                <div class="config-badge" :class="store.wallPhoto ? 'config-badge--done' : 'config-badge--active'">
                  <Check v-if="store.wallPhoto" class="w-4 h-4" />
                  <span v-else>01</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h3 class="font-display font-semibold text-text">Photo de votre mur</h3>
                    <span class="req-badge req-badge--required">Requis</span>
                  </div>
                  <p class="text-text-3 text-xs">Photographiez le mur entier en lumière naturelle pour un rendu IA optimal</p>
                </div>
              </div>
              <FileDropzone
                v-model="store.wallPhoto"
                placeholder="Glissez ou cliquez pour importer votre mur"
                hint="PNG, JPG, WEBP · max 10 Mo · lumière naturelle recommandée"
                icon="upload"
                required
                :error="errors.wall"
                @update:modelValue="store.setWallPhoto"
              />
            </div>

            <!-- Step 2 — Reference photo -->
            <div class="config-card" :class="store.referencePhoto ? 'config-card--done' : ''" style="--cc: #F472B6">
              <div class="config-accent" />
              <div class="flex items-start gap-4 mb-5">
                <div class="config-badge" :class="store.referencePhoto ? 'config-badge--done' : 'config-badge--idle'">
                  <Check v-if="store.referencePhoto" class="w-4 h-4" />
                  <span v-else>02</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h3 class="font-display font-semibold text-text">Image de référence</h3>
                    <span class="req-badge req-badge--optional">Optionnel</span>
                  </div>
                  <p class="text-text-3 text-xs">Un artiste, un style, une ambiance — guidez notre IA pour un résultat plus précis</p>
                </div>
              </div>
              <FileDropzone
                v-model="store.referencePhoto"
                placeholder="Glissez ou cliquez pour importer une inspiration"
                hint="Style, artiste, ambiance souhaitée"
                icon="image"
                @update:modelValue="store.setReferencePhoto"
              />
            </div>

            <!-- Step 3 — Description -->
            <div class="config-card" :class="store.description.length > 20 ? 'config-card--done' : ''" style="--cc: #3D7BFF">
              <div class="config-accent" />
              <div class="flex items-start gap-4 mb-5">
                <div class="config-badge" :class="store.description.length > 20 ? 'config-badge--done' : 'config-badge--idle'">
                  <Check v-if="store.description.length > 20" class="w-4 h-4" />
                  <span v-else>03</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <h3 class="font-display font-semibold text-text">Description du projet</h3>
                    <span class="req-badge req-badge--required">Requis</span>
                  </div>
                  <p class="text-text-3 text-xs">Style, couleurs, dimensions, inspiration — plus vous êtes précis, plus le résultat est fidèle</p>
                </div>
              </div>
              <BaseInput
                v-model="store.description"
                type="textarea"
                placeholder="Ex : Fresque street art colorée, tons chauds, motifs floraux et géométriques, inspiré du style de Retna — mur en béton lisse, 8m × 4m, exposition sud…"
                :rows="5"
                :error="errors.description"
              />
              <div class="flex items-center justify-between mt-2.5">
                <span class="text-text-3 text-xs font-mono">{{ store.description.length }} car.</span>
                <span class="text-xs transition-colors" :class="store.description.length >= 20 ? 'text-success' : 'text-text-3'">
                  {{ store.description.length >= 20 ? '✓ Bonne longueur' : 'Min. 20 recommandés' }}
                </span>
              </div>
            </div>

            <!-- ── CTA BLOCK ──────────────────────────────────────── -->
            <div class="cta-block">
              <!-- Spray accent -->
              <div class="absolute -top-8 right-8 w-48 h-48 rounded-full pointer-events-none"
                style="background:#3D7BFF; filter:blur(70px); opacity:0.08;" />

              <div class="relative z-10">
                <!-- Checklist -->
                <div class="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                  <div class="check-row" :class="store.wallPhoto ? 'check-row--done' : ''">
                    <CheckCircle2 v-if="store.wallPhoto" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Photo du mur
                  </div>
                  <div class="check-row check-row--done" v-if="store.referencePhoto">
                    <CheckCircle2 class="w-3.5 h-3.5" />
                    Référence visuelle
                  </div>
                  <div class="check-row" :class="store.description.length > 20 ? 'check-row--done' : ''">
                    <CheckCircle2 v-if="store.description.length > 20" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Description
                  </div>
                </div>

                <!-- Button row -->
                <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <BaseButton type="submit" size="lg" :loading="loading" class="w-full sm:w-auto">
                    <Sparkles class="w-4 h-4" />
                    Générer ma fresque →
                  </BaseButton>
                  <div>
                    <p class="text-text-3 text-xs font-mono">⚡ Résultat en ~2 secondes</p>
                    <p class="text-text-3 text-xs">Gratuit · Sans engagement</p>
                  </div>
                </div>
              </div>
            </div>

          </form>
        </div>

        <!-- ── RIGHT: SIDEBAR ─────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-5 lg:sticky lg:top-24">

          <!-- Live wall preview -->
          <div class="preview-card">
            <div class="preview-card-header">
              <span class="font-mono text-xs font-bold uppercase tracking-widest text-text-2">Aperçu live</span>
              <span class="flex items-center gap-1.5 text-xs text-text-3">
                <span class="w-1.5 h-1.5 rounded-full transition-colors"
                  :class="store.wallPhotoUrl ? 'bg-success' : 'bg-border-strong'" />
                {{ store.wallPhotoUrl ? 'Photo importée' : 'En attente' }}
              </span>
            </div>
            <div class="aspect-video bg-surface-2 relative overflow-hidden">
              <Transition name="preview">
                <img v-if="store.wallPhotoUrl" :src="store.wallPhotoUrl" alt="Votre mur" class="w-full h-full object-cover" />
                <div v-else class="absolute inset-0 flex flex-col items-center justify-center gap-3 text-text-3 p-6 text-center">
                  <!-- Dashed placeholder frame -->
                  <div class="w-16 h-16 rounded-xl border-2 border-dashed border-border-strong flex items-center justify-center">
                    <ImageIcon class="w-7 h-7 opacity-40" />
                  </div>
                  <p class="text-xs leading-relaxed opacity-60">Importez votre photo<br />de mur pour prévisualiser</p>
                </div>
              </Transition>
              <!-- "VOTRE MUR" watermark -->
              <div v-if="!store.wallPhotoUrl"
                class="absolute bottom-2 right-2 font-mono text-[9px] font-bold uppercase tracking-widest text-text-3/30 select-none">
                VOTRE MUR
              </div>
            </div>
          </div>

          <!-- What happens next -->
          <div class="next-card">
            <div class="flex items-center gap-2 mb-5">
              <span class="w-4 h-px bg-accent" />
              <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Ce qui se passe ensuite</p>
            </div>
            <div class="space-y-3">
              <div v-for="(n, i) in nextSteps" :key="i" class="next-step" :style="{ '--ns': n.color }">
                <div class="next-step-num">{{ String(i+2).padStart(2,'0') }}</div>
                <div class="flex-1 min-w-0">
                  <p class="font-display font-semibold text-text text-sm leading-tight">{{ n.title }}</p>
                  <p class="text-text-3 text-xs mt-0.5 leading-relaxed">{{ n.desc }}</p>
                </div>
                <component :is="n.icon" class="w-4 h-4 shrink-0 opacity-60" :style="{ color: n.color }" />
              </div>
            </div>
          </div>

          <!-- Tips -->
          <div class="bg-surface-1 border border-border rounded-xl p-5">
            <p class="font-display font-semibold text-text text-sm mb-4 flex items-center gap-2">
              <Lightbulb class="w-4 h-4 text-warning shrink-0" />
              Conseils pour un meilleur résultat
            </p>
            <ul class="space-y-2.5">
              <li v-for="tip in tips" :key="tip.text" class="flex items-start gap-2.5">
                <component :is="tip.icon" class="w-3.5 h-3.5 shrink-0 mt-0.5" :style="{ color: tip.color }" />
                <span class="text-text-2 text-xs leading-relaxed">{{ tip.text }}</span>
              </li>
            </ul>
          </div>

          <!-- Portfolio link -->
          <RouterLink to="/portfolio"
            class="flex items-center gap-4 p-4 bg-surface-1 border border-border rounded-xl hover:border-accent/40 hover:bg-surface-2 transition-all group">
            <div class="w-10 h-10 rounded-lg bg-surface-2 border border-border flex items-center justify-center text-text-3 group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
              <GalleryHorizontal class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-display font-semibold text-text text-sm">Voir nos réalisations</p>
              <p class="text-text-3 text-xs mt-0.5">Inspirez-vous de +200 fresques</p>
            </div>
            <ChevronRight class="w-4 h-4 text-text-3 group-hover:text-accent transition-colors shrink-0 group-hover:translate-x-0.5" />
          </RouterLink>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronRight, Check, CheckCircle2, Circle,
  Sparkles, Lightbulb, ImageIcon, Eye, FileText,
  Sun, Maximize2, AlignLeft, GalleryHorizontal,
} from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'
import { generateFresco } from '@/mocks/api.js'
import NavBar from '@/components/layout/NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import FileDropzone from '@/components/ui/FileDropzone.vue'

const store = useRequestStore()
const router = useRouter()
const loading = ref(false)
const errors = reactive({ wall: '', description: '' })

const funnelSteps = [
  { label: 'Configurer',    color: '#FB923C' },
  { label: 'Visualiser',   color: '#3D7BFF' },
  { label: 'Recevoir devis', color: '#4ADE80' },
]

const stickers = [
  { label: 'IA Générative', color: '#3D7BFF', rotate: -3 },
  { label: 'Gratuit',       color: '#4ADE80', rotate:  2 },
  { label: 'Art Mural',     color: '#FB923C', rotate: -2 },
  { label: '~2 secondes',   color: '#F472B6', rotate:  2 },
]

const nextSteps = [
  {
    title: "L'IA génère votre fresque",
    desc: "En ~2 secondes, notre modèle visualise votre fresque sur le mur réel.",
    color: '#3D7BFF',
    icon: Sparkles,
  },
  {
    title: 'Vous visualisez le rendu',
    desc: "Comparez l'avant/après et régénérez si besoin, sans limite.",
    color: '#A78BFA',
    icon: Eye,
  },
  {
    title: 'Vous recevez votre devis',
    desc: "Nos artistes préparent un devis personnalisé sous 24h.",
    color: '#4ADE80',
    icon: FileText,
  },
]

const tips = [
  { icon: Sun,       color: '#FBBF24', text: 'Photographiez le mur en pleine lumière naturelle pour un meilleur rendu.' },
  { icon: Maximize2, color: '#3D7BFF', text: 'Cadrez le mur entier dans l\'image, sans objets qui le cachent.' },
  { icon: AlignLeft, color: '#F472B6', text: 'Plus votre description est précise, plus le résultat est fidèle à votre vision.' },
  { icon: ImageIcon, color: '#4ADE80', text: 'Une image de référence (artiste, style) améliore significativement la génération.' },
]

async function handleGenerate() {
  errors.wall = ''
  if (!store.wallPhoto) {
    errors.wall = 'La photo du mur est obligatoire.'
    return
  }
  loading.value = true
  try {
    const url = await generateFresco(store.wallPhoto, store.referencePhoto, store.description)
    store.setGeneratedImage(url)
    router.push('/resultat')
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
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
.spray-cyan   { background: #22D3EE; }

/* ── Hero animations ────────────────────────────────────────────── */
.h-eyebrow  { animation: fade-up 0.4s ease 0.05s both; }
.h-eyebrow2 { animation: fade-up 0.5s ease 0.12s both; }
.h-title    { animation: fade-up 0.6s ease 0.22s both; }
.h-sub      { animation: fade-up 0.5s ease 0.36s both; }
.h-funnel   { animation: fade-up 0.5s ease 0.48s both; }
.h-stickers { animation: fade-left 0.6s ease 0.2s both; }

/* ── Stickers ───────────────────────────────────────────────────── */
.sticker {
  display: inline-block;
  padding: 5px 12px;
  border: 2px solid var(--sc);
  color: var(--sc);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
  background: rgba(0,0,0,0.25);
  animation: fade-left 0.5s ease both;
  transition: box-shadow 0.2s;
}
.sticker:hover { box-shadow: 0 0 14px color-mix(in srgb, var(--sc) 40%, transparent); }

/* ── Funnel steps ───────────────────────────────────────────────── */
.funnel-step {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
  transition: border-color 0.2s, background 0.2s;
}
.funnel-step--active {
  border-color: rgba(61,123,255,0.35);
  background: rgba(61,123,255,0.08);
}
.funnel-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  color: var(--fs);
  letter-spacing: 0.05em;
}
.funnel-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-2);
}
.funnel-step--active .funnel-label { color: var(--color-text); }

/* ── Config cards ───────────────────────────────────────────────── */
.config-card {
  position: relative;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.config-card:nth-child(1) { animation-delay: 0.05s; }
.config-card:nth-child(2) { animation-delay: 0.13s; }
.config-card:nth-child(3) { animation-delay: 0.21s; }
.config-card:hover {
  border-color: color-mix(in srgb, var(--cc) 40%, transparent);
}
.config-card--done {
  border-color: color-mix(in srgb, var(--cc) 30%, transparent);
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--cc) 12%, transparent);
}

/* Left accent bar */
.config-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--cc);
  border-radius: 12px 0 0 12px;
  opacity: 0.6;
  transition: width 0.2s, opacity 0.2s;
}
.config-card:hover .config-accent,
.config-card--done .config-accent { opacity: 1; width: 4px; }

/* Step badge */
.config-badge {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
}
.config-badge--active {
  background: color-mix(in srgb, var(--cc) 18%, transparent);
  color: var(--cc);
  border: 1px solid color-mix(in srgb, var(--cc) 35%, transparent);
}
.config-badge--idle {
  background: var(--color-surface-2);
  color: var(--color-text-3);
  border: 1px solid var(--color-border-strong);
}
.config-badge--done {
  background: var(--color-success);
  color: var(--color-bg);
  border: none;
}

/* Required / optional badges */
.req-badge {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 7px;
  border-radius: 3px;
  border: 1px solid;
}
.req-badge--required {
  color: #FBBF24;
  border-color: rgba(251,191,36,0.35);
  background: rgba(251,191,36,0.07);
}
.req-badge--optional {
  color: var(--color-text-3);
  border-color: var(--color-border-strong);
  background: transparent;
}

/* ── CTA block ──────────────────────────────────────────────────── */
.cta-block {
  position: relative;
  background: var(--color-surface-1);
  border: 1.5px solid var(--color-border-strong);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease 0.3s both;
}

.check-row {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--color-text-3);
  transition: color 0.2s;
}
.check-row--done { color: var(--color-success); }

/* ── Preview card ───────────────────────────────────────────────── */
.preview-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
}
.preview-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

/* ── What's next card ───────────────────────────────────────────── */
.next-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
}
.next-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: border-color 0.15s, background 0.15s;
}
.next-step:hover {
  border-color: color-mix(in srgb, var(--ns) 25%, transparent);
  background: color-mix(in srgb, var(--ns) 5%, transparent);
}
.next-step-num {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  color: var(--ns);
  flex-shrink: 0;
  padding-top: 2px;
}

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Preview transition ─────────────────────────────────────────── */
.preview-enter-active, .preview-leave-active { transition: opacity 0.3s ease; }
.preview-enter-from, .preview-leave-to { opacity: 0; }

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-eyebrow, .h-eyebrow2, .h-title, .h-sub,
  .h-funnel, .h-stickers, .sticker,
  .config-card, .cta-block { animation: none; }
  .config-accent, .config-badge, .next-step { transition: none; }
}
</style>
