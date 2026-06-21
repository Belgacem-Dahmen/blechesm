<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <Transition name="fade" mode="out-in">

      <!-- ── LOADING STATE ─────────────────────────────────────────────── -->
      <div v-if="isLoading" key="loading" class="min-h-screen flex flex-col items-center justify-center px-4 pt-16 relative overflow-hidden">
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style="background:#3D7BFF; filter:blur(120px); opacity:0.06;" />

        <div class="relative w-full max-w-sm text-center z-10">
          <!-- Spinner -->
          <div class="relative w-24 h-24 mx-auto mb-7">
            <div class="absolute inset-0 rounded-full border-2 border-accent/20" />
            <div class="absolute inset-0 rounded-full border-2 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin" />
            <div class="absolute inset-3 rounded-full border border-accent/10 bg-surface-1 flex items-center justify-center">
              <Sparkles class="w-6 h-6 text-accent animate-pulse" />
            </div>
          </div>

          <!-- Sticker -->
          <div class="inline-block mb-5 px-3 py-1 border-2 border-accent/40 text-accent rounded font-mono text-[10px] font-bold uppercase tracking-widest"
            style="background: rgba(61,123,255,0.07); transform: rotate(-1deg)">
            IA au travail
          </div>

          <h2 class="font-display font-semibold text-text text-2xl mb-2">Génération en cours…</h2>
          <p class="text-text-3 text-sm mb-8 leading-relaxed">
            Notre IA analyse votre mur et compose<br />une fresque personnalisée.
          </p>

          <!-- Progress bar -->
          <div class="w-full bg-surface-2 rounded-full h-1.5 mb-2 overflow-hidden">
            <div class="h-full bg-accent rounded-full loading-bar" />
          </div>
          <p class="text-text-3 text-xs font-mono">⚡ Environ 2–3 secondes</p>

          <!-- Tips -->
          <div class="mt-10 p-5 bg-surface-1 border border-border rounded-xl text-left space-y-3">
            <p class="text-text-3 text-xs uppercase tracking-widest mb-2 font-mono font-bold">Pendant ce temps…</p>
            <div v-for="tip in loadingTips" :key="tip" class="flex items-start gap-2.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
              <span class="text-text-2 text-xs leading-relaxed">{{ tip }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ── RESULT STATE ────────────────────────────────────────────── -->
      <div v-else-if="store.generatedImage" key="result">

        <!-- ── HERO ──────────────────────────────────────────────────── -->
        <section class="relative pt-24 pb-20 overflow-hidden">
          <div class="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
          <div class="spray spray-blue   absolute -top-24 -right-24 w-[480px] h-[480px]" />
          <div class="spray spray-purple absolute -bottom-24 -left-24 w-[360px] h-[360px]" />

          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-1.5 mb-8 text-xs text-text-3 h-eyebrow">
              <RouterLink to="/" class="hover:text-text transition-colors">Accueil</RouterLink>
              <ChevronRight class="w-3 h-3" />
              <RouterLink to="/configurateur" class="hover:text-text transition-colors">Configurateur</RouterLink>
              <ChevronRight class="w-3 h-3" />
              <span class="text-accent font-medium">Résultat</span>
            </nav>

            <div class="flex items-start justify-between gap-8">
              <div class="max-w-2xl">
                <!-- Eyebrow -->
                <div class="flex items-center gap-3 mb-5 h-eyebrow2">
                  <span class="w-6 h-px bg-success" />
                  <span class="text-xs font-mono uppercase tracking-widest text-success">Fresque générée avec succès</span>
                  <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
                    <path d="M3,11 C12,4 30,4 42,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M35,6 L43,12 L35,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.92] mb-5 h-title">
                  Votre fresque,<br />
                  <span class="relative inline-block text-accent">
                    générée.
                    <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                      <path d="M0,4 Q25,0 50,4 Q75,8 100,4 Q125,0 150,4 Q175,8 200,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                    </svg>
                  </span>
                </h1>

                <p class="text-text-2 text-base leading-relaxed mb-8 max-w-lg h-sub">
                  Comparez l'avant et l'après. Si le rendu vous convient, demandez votre devis — nos artistes vous répondent sous 48h.
                </p>

                <!-- Funnel — step 02 active -->
                <div class="flex items-center gap-0 h-funnel">
                  <div v-for="(step, i) in funnelSteps" :key="i" class="flex items-center">
                    <div class="funnel-step" :style="{ '--fs': step.color }"
                      :class="{
                        'funnel-step--done':   i < 1,
                        'funnel-step--active': i === 1,
                      }">
                      <Check v-if="i < 1" class="w-3 h-3 shrink-0" style="color:#4ADE80" />
                      <span v-else class="funnel-num">{{ String(i+1).padStart(2,'0') }}</span>
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

        </section>

        <!-- ── MAIN CONTENT ──────────────────────────────────────────── -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            <!-- ── LEFT: IMAGE COMPARISON ─────────────────────────── -->
            <div class="lg:col-span-3 space-y-4">

              <!-- Before card -->
              <div class="config-card img-card-before" style="--cc: #94A3B8">
                <div class="config-accent" />
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="config-badge config-badge--idle"><span>01</span></div>
                    <div>
                      <p class="font-display font-semibold text-text">Avant — Votre mur</p>
                      <p class="text-text-3 text-xs">Photo originale importée</p>
                    </div>
                  </div>
                  <span class="req-badge req-badge--optional">Original</span>
                </div>
                <div class="aspect-video overflow-hidden rounded-lg bg-surface-2">
                  <img v-if="store.wallPhotoUrl" :src="store.wallPhotoUrl" alt="Votre mur original" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <div class="text-center text-text-3">
                      <ImageIcon class="w-10 h-10 opacity-30 mx-auto mb-2" />
                      <p class="text-xs">Photo non disponible</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- After card -->
              <div class="config-card config-card--done img-card-after" style="--cc: #4ADE80">
                <div class="config-accent" />
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-3">
                    <div class="config-badge config-badge--done"><Sparkles class="w-4 h-4" /></div>
                    <div>
                      <p class="font-display font-semibold text-text">Après — Fresque IA</p>
                      <p class="text-text-3 text-xs">Générée en ~2.5 secondes</p>
                    </div>
                  </div>
                  <span class="req-badge req-badge--success">Nouveau</span>
                </div>
                <div class="aspect-video overflow-hidden rounded-lg bg-surface-2 relative">
                  <img :src="store.generatedImage" alt="Fresque générée par IA" class="w-full h-full object-cover" />
                  <div class="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-pill font-mono text-[10px] font-bold uppercase tracking-widest text-bg"
                    style="background: #4ADE80; box-shadow: 0 0 12px rgba(74,222,128,0.4)">
                    <Sparkles class="w-3 h-3" />
                    IA
                  </div>
                </div>
              </div>

              <!-- Regenerate note -->
              <p class="text-text-3 text-xs text-center pb-2">
                Le résultat ne vous convient pas ?
                <button @click="regenerate" class="text-accent hover:underline ml-1 font-medium">Régénérer une variante</button>
              </p>
            </div>

            <!-- ── RIGHT: SIDEBAR ──────────────────────────────────── -->
            <div class="lg:col-span-2 space-y-4 lg:sticky lg:top-24">

              <!-- CTA card -->
              <div class="cta-block">
                <div class="absolute -top-8 right-8 w-48 h-48 rounded-full pointer-events-none"
                  style="background:#4ADE80; filter:blur(70px); opacity:0.07;" />
                <div class="relative z-10">
                  <div class="flex items-center gap-3 mb-5">
                    <div class="w-9 h-9 rounded-full bg-success flex items-center justify-center shrink-0">
                      <Check class="w-4 h-4 text-bg" />
                    </div>
                    <div>
                      <p class="font-display font-semibold text-text text-sm">Fresque générée</p>
                      <p class="text-text-3 text-xs font-mono">⚡ En ~2.5 secondes</p>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2.5">
                    <RouterLink to="/devis" class="block">
                      <BaseButton size="lg" class="w-full">
                        Demander un devis →
                      </BaseButton>
                    </RouterLink>
                    <BaseButton variant="ghost" size="md" class="w-full" @click="regenerate" :loading="regenerating">
                      <RefreshCw class="w-3.5 h-3.5" />
                      Régénérer
                    </BaseButton>
                    <RouterLink to="/configurateur" class="block">
                      <BaseButton variant="secondary" size="md" class="w-full">
                        <Settings class="w-3.5 h-3.5" />
                        Modifier les paramètres
                      </BaseButton>
                    </RouterLink>
                  </div>
                </div>
              </div>

              <!-- Recap card -->
              <div class="next-card">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-4 h-px bg-accent" />
                  <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Récapitulatif</p>
                </div>

                <div v-if="store.description" class="mb-4">
                  <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Description</p>
                  <p class="text-text-2 text-xs leading-relaxed line-clamp-4">{{ store.description }}</p>
                </div>

                <div v-if="store.referencePhotoUrl" class="mb-4">
                  <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Référence</p>
                  <div class="w-full aspect-video rounded-lg overflow-hidden border border-border">
                    <img :src="store.referencePhotoUrl" alt="Référence" class="w-full h-full object-cover" />
                  </div>
                </div>

                <div class="pt-3 border-t border-border space-y-2">
                  <div class="check-row" :class="store.wallPhotoUrl ? 'check-row--done' : ''">
                    <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
                    Photo du mur importée
                  </div>
                  <div v-if="store.referencePhotoUrl" class="check-row check-row--done">
                    <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
                    Référence visuelle fournie
                  </div>
                  <div class="check-row" :class="store.description.length > 0 ? 'check-row--done' : ''">
                    <CheckCircle2 v-if="store.description.length > 0" class="w-3.5 h-3.5 shrink-0" />
                    <Circle v-else class="w-3.5 h-3.5 shrink-0" />
                    Description du projet
                  </div>
                  <div class="check-row check-row--done">
                    <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
                    Fresque générée par IA
                  </div>
                </div>
              </div>

              <!-- Next step card -->
              <div class="next-card">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-4 h-px bg-accent" />
                  <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Étape suivante</p>
                </div>
                <div class="next-step" style="--ns: #4ADE80">
                  <div class="next-step-num">03</div>
                  <div class="flex-1 min-w-0">
                    <p class="font-display font-semibold text-text text-sm leading-tight">Recevoir votre devis</p>
                    <p class="text-text-3 text-xs mt-0.5 leading-relaxed">Renseignez les dimensions et vos coordonnées. Nos artistes vous répondent sous 48h.</p>
                  </div>
                  <FileText class="w-4 h-4 shrink-0 opacity-60 text-success" />
                </div>
                <RouterLink to="/devis" class="mt-4 flex items-center gap-1.5 text-accent text-xs font-medium hover:underline">
                  Accéder au formulaire de devis
                  <ChevronRight class="w-3.5 h-3.5" />
                </RouterLink>
              </div>

            </div>
          </div>
        </main>
      </div>

      <!-- ── EMPTY STATE ─────────────────────────────────────────────── -->
      <div v-else key="empty" class="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 text-center">
        <div class="w-16 h-16 rounded-xl bg-surface-2 flex items-center justify-center mx-auto mb-6">
          <ImageIcon class="w-8 h-8 text-text-3 opacity-40" />
        </div>
        <h2 class="font-display font-semibold text-text text-xl mb-2">Aucune génération disponible</h2>
        <p class="text-text-2 text-sm mb-6 max-w-xs">Commencez par configurer votre fresque depuis le configurateur.</p>
        <RouterLink to="/configurateur">
          <BaseButton size="lg">Aller au configurateur →</BaseButton>
        </RouterLink>
      </div>

    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  ChevronRight, Check, CheckCircle2, Circle,
  Sparkles, ImageIcon, RefreshCw, Settings, FileText,
} from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'
import { generateFresco } from '@/mocks/api.js'
import NavBar from '@/components/layout/NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const store = useRequestStore()
const isLoading = ref(false)
const regenerating = ref(false)

const funnelSteps = [
  { label: 'Configurer',     color: '#FB923C' },
  { label: 'Visualiser',    color: '#3D7BFF' },
  { label: 'Recevoir devis', color: '#4ADE80' },
]

const stickers = [
  { label: 'Avant / Après',   color: '#3D7BFF', rotate: -3 },
  { label: 'Généré par IA',   color: '#4ADE80', rotate:  2 },
  { label: '~2 secondes',     color: '#F472B6', rotate: -2 },
  { label: 'Art Mural',       color: '#FB923C', rotate:  2 },
]

const loadingTips = [
  'Analyse de la texture et des dimensions du mur',
  'Application du style et des références visuelles',
  'Composition de la fresque en haute résolution',
]

onMounted(() => {
  if (!store.generatedImage && store.wallPhoto) {
    runGeneration()
  }
})

async function runGeneration() {
  isLoading.value = true
  try {
    const url = await generateFresco(store.wallPhoto, store.referencePhoto, store.description)
    store.setGeneratedImage(url)
  } finally {
    isLoading.value = false
  }
}

async function regenerate() {
  regenerating.value = true
  store.setGeneratedImage(null)
  isLoading.value = true
  try {
    const url = await generateFresco(store.wallPhoto, store.referencePhoto, store.description)
    store.setGeneratedImage(url)
  } finally {
    regenerating.value = false
    isLoading.value = false
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
.spray-blue   { background: #3D7BFF; }
.spray-purple { background: #A78BFA; }

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
.funnel-step--done {
  border-color: rgba(74,222,128,0.25);
  background: rgba(74,222,128,0.05);
  opacity: 0.75;
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
  transition: border-color 0.2s, box-shadow 0.2s;
}
.img-card-before { animation: fade-up 0.45s ease 0.05s both; }
.img-card-after  { animation: fade-up 0.45s ease 0.15s both; }
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
  left: 0; top: 0; bottom: 0;
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
  width: 40px; height: 40px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--font-mono);
  font-size: 11px; font-weight: 800; letter-spacing: 0.05em;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
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

/* Required / optional / success badges */
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
.req-badge--optional {
  color: var(--color-text-3);
  border-color: var(--color-border-strong);
  background: transparent;
}
.req-badge--success {
  color: #4ADE80;
  border-color: rgba(74,222,128,0.35);
  background: rgba(74,222,128,0.07);
}

/* ── CTA block ──────────────────────────────────────────────────── */
.cta-block {
  position: relative;
  background: var(--color-surface-1);
  border: 1.5px solid var(--color-border-strong);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease 0.05s both;
}

/* ── Next card ──────────────────────────────────────────────────── */
.next-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  animation: fade-up 0.45s ease 0.15s both;
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

/* ── Check rows ─────────────────────────────────────────────────── */
.check-row {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-3);
  transition: color 0.2s;
}
.check-row--done { color: var(--color-success); }

/* ── Loading bar ────────────────────────────────────────────────── */
.loading-bar { animation: progress 2.5s ease-in-out forwards; }
@keyframes progress { from { width: 0%; } to { width: 92%; } }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Keyframes ──────────────────────────────────────────────────── */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-left {
  from { opacity: 0; transform: translateX(20px); }
  to   { opacity: 1; transform: translateX(0); }
}

/* ── Fade transition ────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── Reduced motion ─────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .h-eyebrow, .h-eyebrow2, .h-title, .h-sub,
  .h-funnel, .h-stickers, .sticker,
  .img-card-before, .img-card-after,
  .cta-block, .next-card, .loading-bar { animation: none; }
  .config-accent, .config-badge, .next-step { transition: none; }
  .animate-spin { animation: none; }
}
</style>
