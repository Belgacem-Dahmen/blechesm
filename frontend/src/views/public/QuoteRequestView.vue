<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <Transition name="fade" mode="out-in">

      <!-- ── CONFIRMATION STATE ─────────────────────────────────────── -->
      <div v-if="confirmed" key="confirmed" class="relative min-h-screen flex items-center justify-center px-4 pt-16 overflow-hidden">
        <!-- Spray blob -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style="background:#4ADE80; filter:blur(130px); opacity:0.05;" />

        <div class="relative z-10 w-full max-w-lg text-center confirmed-card">
          <!-- Sticker -->
          <div class="inline-block mb-6 px-3 py-1 border-2 border-success/40 text-success rounded font-mono text-[10px] font-bold uppercase tracking-widest"
            style="background: rgba(74,222,128,0.07); transform: rotate(-1deg)">
            Demande envoyée ✓
          </div>

          <!-- Success icon -->
          <div class="w-20 h-20 rounded-2xl bg-success/10 border border-success/25 flex items-center justify-center mx-auto mb-7"
            style="box-shadow: 0 0 40px rgba(74,222,128,0.12)">
            <CheckCircle2 class="w-10 h-10 text-success" />
          </div>

          <h1 class="font-display text-4xl sm:text-5xl font-semibold tracking-tightest mb-4 leading-[0.92]">
            Merci, {{ store.contact.name || 'vous' }} !<br />
            <span class="relative inline-block text-accent" style="font-size: 0.75em">
              On vous répond sous 48h.
              <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                <path d="M0,4 Q50,0 100,4 Q150,8 200,4 Q250,0 300,4 Q350,8 400,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
              </svg>
            </span>
          </h1>

          <p class="text-text-2 text-base leading-relaxed mb-8 max-w-sm mx-auto mt-3">
            Votre demande a bien été reçue. Nos artistes étudient votre projet et vous contactent à
            <strong class="text-text">{{ store.contact.email }}</strong>.
          </p>

          <!-- What happens next -->
          <div class="next-card mb-6 text-left">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-4 h-px bg-accent" />
              <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">La suite du processus</p>
            </div>
            <div class="space-y-1">
              <div v-for="(step, i) in nextSteps" :key="i" class="next-step" :style="{ '--ns': step.color }">
                <div class="next-step-num">{{ String(i+1).padStart(2,'0') }}</div>
                <p class="text-text-2 text-sm leading-relaxed">{{ step.text }}</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <RouterLink to="/"><BaseButton size="lg">Retour à l'accueil</BaseButton></RouterLink>
            <RouterLink to="/portfolio"><BaseButton variant="secondary" size="lg">Voir le portfolio</BaseButton></RouterLink>
          </div>
        </div>
      </div>

      <!-- ── FORM STATE ─────────────────────────────────────────────── -->
      <div v-else key="form">

        <!-- ── HERO ────────────────────────────────────────────────── -->
        <section class="relative pt-24 pb-20 overflow-hidden">
          <div class="absolute inset-0 grid-bg opacity-15 pointer-events-none" />
          <div class="spray spray-green  absolute -top-24 -right-24 w-[480px] h-[480px]" />
          <div class="spray spray-orange absolute -bottom-24 -left-24 w-[360px] h-[360px]" />

          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Breadcrumb -->
            <nav class="flex items-center gap-1.5 mb-8 text-xs text-text-3 h-eyebrow">
              <RouterLink to="/" class="hover:text-text transition-colors">Accueil</RouterLink>
              <ChevronRight class="w-3 h-3" />
              <RouterLink to="/configurateur" class="hover:text-text transition-colors">Configurateur</RouterLink>
              <ChevronRight class="w-3 h-3" />
              <RouterLink to="/resultat" class="hover:text-text transition-colors">Résultat</RouterLink>
              <ChevronRight class="w-3 h-3" />
              <span class="text-accent font-medium">Devis</span>
            </nav>

            <div class="flex items-start justify-between gap-8">
              <div class="max-w-2xl">
                <!-- Eyebrow -->
                <div class="flex items-center gap-3 mb-5 h-eyebrow2">
                  <span class="w-6 h-px bg-accent" />
                  <span class="text-xs font-mono uppercase tracking-widest text-accent">Demande de devis gratuit</span>
                  <svg width="48" height="22" viewBox="0 0 48 22" class="text-warning opacity-60 hidden sm:block" fill="none" aria-hidden="true">
                    <path d="M3,11 C12,4 30,4 42,11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M35,6 L43,12 L35,16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>

                <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tightest leading-[0.92] mb-5 h-title">
                  Finalisez votre<br />
                  <span class="relative inline-block text-accent">
                    demande.
                    <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 200 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                      <path d="M0,4 Q25,0 50,4 Q75,8 100,4 Q125,0 150,4 Q175,8 200,4" stroke="#FF6B35" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
                    </svg>
                  </span>
                </h1>

                <p class="text-text-2 text-base leading-relaxed mb-8 max-w-lg h-sub">
                  Renseignez les dimensions et vos coordonnées. Nos artistes vous envoient un devis personnalisé sous 48h — gratuitement, sans engagement.
                </p>

                <!-- Funnel — step 03 active -->
                <div class="flex items-center gap-0 h-funnel">
                  <div v-for="(step, i) in funnelSteps" :key="i" class="flex items-center">
                    <div class="funnel-step" :style="{ '--fs': step.color }"
                      :class="{
                        'funnel-step--done':   i < 2,
                        'funnel-step--active': i === 2,
                      }">
                      <Check v-if="i < 2" class="w-3 h-3 shrink-0" style="color:#4ADE80" />
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

          <!-- Drip -->
          <div class="absolute bottom-0 left-0 right-0 leading-[0] pointer-events-none">
            <svg viewBox="0 0 1440 36" preserveAspectRatio="none" class="w-full h-9" aria-hidden="true">
              <path d="M0,0 L1440,0 L1440,12 Q1400,36 1360,12 Q1320,0 1280,20 Q1240,36 1200,16 Q1160,0 1120,18 Q1080,36 1040,16 Q1000,0 960,22 Q920,36 880,18 Q840,4 800,24 Q760,36 720,20 Q680,4 640,22 Q600,36 560,18 Q520,2 480,20 Q440,36 400,16 Q360,0 320,20 Q280,36 240,16 Q200,0 160,22 Q120,36 80,18 Q40,4 0,18 Z" fill="#080B14"/>
            </svg>
          </div>
        </section>

        <!-- ── MAIN CONTENT ──────────────────────────────────────────── -->
        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid lg:grid-cols-5 gap-8 lg:gap-12 items-start">

            <!-- ── LEFT: FORM ────────────────────────────────────────── -->
            <div class="lg:col-span-3 space-y-4">
              <form @submit.prevent="handleSubmit" novalidate>

                <!-- Section 1 — Dimensions -->
                <div class="config-card" :class="dimensionsComplete ? 'config-card--done' : ''" style="--cc: #FB923C">
                  <div class="config-accent" />
                  <div class="flex items-start gap-4 mb-5">
                    <div class="config-badge" :class="dimensionsComplete ? 'config-badge--done' : 'config-badge--active'">
                      <Check v-if="dimensionsComplete" class="w-4 h-4" />
                      <span v-else>01</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap mb-1">
                        <h3 class="font-display font-semibold text-text">Dimensions du mur</h3>
                        <span class="req-badge req-badge--required">Requis</span>
                      </div>
                      <p class="text-text-3 text-xs">En mètres — permet de calculer la surface à peindre et d'affiner le devis</p>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <BaseInput
                      v-model="store.dimensions.width"
                      type="number"
                      label="Largeur (m)"
                      placeholder="ex. 8"
                      required
                      :error="errors.width"
                    />
                    <BaseInput
                      v-model="store.dimensions.height"
                      type="number"
                      label="Hauteur (m)"
                      placeholder="ex. 4"
                      required
                      :error="errors.height"
                    />
                  </div>

                  <div v-if="dimensionsComplete" class="mt-4 flex items-center gap-2 text-xs text-success">
                    <CheckCircle2 class="w-3.5 h-3.5 shrink-0" />
                    Surface calculée :
                    <span class="font-semibold font-mono">{{ (Number(store.dimensions.width) * Number(store.dimensions.height)).toFixed(1) }} m²</span>
                  </div>
                </div>

                <!-- Section 2 — Contact -->
                <div class="config-card" :class="contactComplete ? 'config-card--done' : ''" style="--cc: #F472B6">
                  <div class="config-accent" />
                  <div class="flex items-start gap-4 mb-5">
                    <div class="config-badge" :class="contactComplete ? 'config-badge--done' : dimensionsComplete ? 'config-badge--active' : 'config-badge--idle'">
                      <Check v-if="contactComplete" class="w-4 h-4" />
                      <span v-else>02</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 flex-wrap mb-1">
                        <h3 class="font-display font-semibold text-text">Vos coordonnées</h3>
                        <span class="req-badge req-badge--required">Requis</span>
                      </div>
                      <p class="text-text-3 text-xs">Pour que nos artistes puissent vous contacter avec votre devis personnalisé</p>
                    </div>
                  </div>

                  <div class="space-y-4">
                    <BaseInput
                      v-model="store.contact.name"
                      label="Nom complet"
                      placeholder="Marie Dupont"
                      required
                      :error="errors.name"
                    />
                    <div class="grid sm:grid-cols-2 gap-4">
                      <BaseInput
                        v-model="store.contact.email"
                        type="email"
                        label="Email"
                        placeholder="marie@exemple.fr"
                        required
                        :error="errors.email"
                      />
                      <BaseInput
                        v-model="store.contact.phone"
                        type="tel"
                        label="Téléphone"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    <BaseInput
                      v-model="store.contact.city"
                      label="Ville"
                      placeholder="Tunis"
                      required
                      :error="errors.city"
                    />
                  </div>
                </div>

                <!-- CTA block -->
                <div class="cta-block">
                  <div class="absolute -top-8 right-8 w-48 h-48 rounded-full pointer-events-none"
                    style="background:#4ADE80; filter:blur(70px); opacity:0.07;" />
                  <div class="relative z-10">
                    <!-- Checklist -->
                    <div class="flex flex-wrap gap-x-6 gap-y-2 mb-5">
                      <div class="check-row" :class="dimensionsComplete ? 'check-row--done' : ''">
                        <CheckCircle2 v-if="dimensionsComplete" class="w-3.5 h-3.5" />
                        <Circle v-else class="w-3.5 h-3.5" />
                        Dimensions
                      </div>
                      <div class="check-row" :class="store.contact.name ? 'check-row--done' : ''">
                        <CheckCircle2 v-if="store.contact.name" class="w-3.5 h-3.5" />
                        <Circle v-else class="w-3.5 h-3.5" />
                        Nom
                      </div>
                      <div class="check-row" :class="store.contact.email ? 'check-row--done' : ''">
                        <CheckCircle2 v-if="store.contact.email" class="w-3.5 h-3.5" />
                        <Circle v-else class="w-3.5 h-3.5" />
                        Email
                      </div>
                      <div class="check-row" :class="store.contact.city ? 'check-row--done' : ''">
                        <CheckCircle2 v-if="store.contact.city" class="w-3.5 h-3.5" />
                        <Circle v-else class="w-3.5 h-3.5" />
                        Ville
                      </div>
                    </div>

                    <!-- Button row -->
                    <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                      <BaseButton type="submit" size="lg" :loading="submitting" class="w-full sm:w-auto">
                        <Send class="w-4 h-4" />
                        Envoyer la demande →
                      </BaseButton>
                      <div>
                        <p class="text-text-3 text-xs font-mono">📬 Réponse sous 48h</p>
                        <p class="text-text-3 text-xs">Gratuit · Sans engagement</p>
                      </div>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <!-- ── RIGHT: SIDEBAR ─────────────────────────────────── -->
            <div class="lg:col-span-2 space-y-4 lg:sticky lg:top-24">

              <!-- Fresco preview -->
              <div class="preview-card">
                <div class="preview-card-header">
                  <span class="font-mono text-xs font-bold uppercase tracking-widest text-text-2">Votre fresque</span>
                  <RouterLink to="/resultat" class="text-xs text-accent hover:underline flex items-center gap-1">
                    Modifier
                    <ChevronRight class="w-3 h-3" />
                  </RouterLink>
                </div>
                <div class="aspect-video bg-surface-2 overflow-hidden">
                  <img v-if="store.generatedImage" :src="store.generatedImage" alt="Fresque générée" class="w-full h-full object-cover" />
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <div class="text-center text-text-3">
                      <ImageIcon class="w-8 h-8 opacity-30 mx-auto mb-2" />
                      <p class="text-xs">Aucune fresque générée</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Project summary -->
              <div class="next-card">
                <div class="flex items-center gap-2 mb-4">
                  <span class="w-4 h-px bg-accent" />
                  <p class="font-mono text-[11px] font-bold uppercase tracking-widest text-accent">Résumé du projet</p>
                </div>

                <div v-if="store.description" class="mb-4">
                  <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Description</p>
                  <p class="text-text-2 text-xs leading-relaxed line-clamp-4">{{ store.description }}</p>
                </div>

                <div v-if="dimensionsComplete" class="mb-4">
                  <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Surface</p>
                  <p class="font-display font-semibold text-text text-lg font-mono">
                    {{ store.dimensions.width }} × {{ store.dimensions.height }} m
                    <span class="text-text-3 text-sm font-normal ml-1">
                      ({{ (Number(store.dimensions.width) * Number(store.dimensions.height)).toFixed(1) }} m²)
                    </span>
                  </p>
                </div>

                <div v-if="store.wallPhotoUrl" class="grid grid-cols-2 gap-3">
                  <div>
                    <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Mur</p>
                    <div class="aspect-video rounded-lg overflow-hidden border border-border bg-surface-2">
                      <img :src="store.wallPhotoUrl" alt="Mur" class="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div v-if="store.referencePhotoUrl">
                    <p class="text-text-3 text-xs uppercase tracking-widest mb-1.5 font-mono">Référence</p>
                    <div class="aspect-video rounded-lg overflow-hidden border border-border bg-surface-2">
                      <img :src="store.referencePhotoUrl" alt="Référence" class="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>

              <!-- Guarantees -->
              <div class="next-card">
                <div class="space-y-3">
                  <div v-for="(g, i) in guarantees" :key="g.text" class="next-step" :style="{ '--ns': g.color }">
                    <div class="next-step-num">{{ String(i+1).padStart(2,'0') }}</div>
                    <span class="text-text-2 text-xs leading-relaxed">{{ g.text }}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>

    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  ChevronRight, Check, CheckCircle2, Circle,
  Send, ImageIcon,
} from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'
import { submitQuote } from '@/mocks/api.js'
import NavBar from '@/components/layout/NavBar.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

const store = useRequestStore()
const submitting = ref(false)
const confirmed = ref(false)
const errors = reactive({ width: '', height: '', name: '', email: '', city: '' })

const funnelSteps = [
  { label: 'Configurer',     color: '#FB923C' },
  { label: 'Visualiser',    color: '#3D7BFF' },
  { label: 'Recevoir devis', color: '#4ADE80' },
]

const stickers = [
  { label: 'Devis gratuit',    color: '#4ADE80', rotate: -3 },
  { label: '48h',              color: '#3D7BFF', rotate:  2 },
  { label: 'Sans engagement',  color: '#FB923C', rotate: -2 },
  { label: 'Personnalisé',     color: '#F472B6', rotate:  2 },
]

const guarantees = [
  { color: '#3D7BFF', text: 'Réponse garantie sous 48h ouvrées' },
  { color: '#4ADE80', text: 'Devis gratuit, sans engagement de votre part' },
  { color: '#FBBF24', text: 'Prix transparent, ajusté à la surface réelle' },
]

const nextSteps = [
  { color: '#3D7BFF', text: 'Nos artistes étudient votre projet et votre fresque générée.' },
  { color: '#A78BFA', text: 'Vous recevez un devis détaillé avec le prix et le planning.' },
  { color: '#4ADE80', text: "Après validation, on fixe ensemble la date d'intervention." },
]

const dimensionsComplete = computed(() =>
  Number(store.dimensions.width) > 0 && Number(store.dimensions.height) > 0
)
const contactComplete = computed(() =>
  store.contact.name && store.contact.email && store.contact.city
)

async function handleSubmit() {
  Object.keys(errors).forEach(k => errors[k] = '')
  let valid = true
  if (!store.dimensions.width)  { errors.width  = 'Requis'; valid = false }
  if (!store.dimensions.height) { errors.height = 'Requis'; valid = false }
  if (!store.contact.name)      { errors.name   = 'Requis'; valid = false }
  if (!store.contact.email)     { errors.email  = 'Requis'; valid = false }
  if (!store.contact.city)      { errors.city   = 'Requis'; valid = false }
  if (!valid) return

  submitting.value = true
  try {
    await submitQuote({
      ...store.dimensions, ...store.contact,
      description: store.description,
      wallPhoto: store.wallPhotoUrl,
      referencePhoto: store.referencePhotoUrl,
      generatedImage: store.generatedImage,
    })
    confirmed.value = true
  } finally {
    submitting.value = false
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
.spray-green  { background: #4ADE80; }
.spray-orange { background: #FF6B35; }

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
.config-card:nth-child(1) { animation: fade-up 0.45s ease 0.05s both; }
.config-card:nth-child(2) { animation: fade-up 0.45s ease 0.13s both; }
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

/* Required badge */
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

/* ── CTA block ──────────────────────────────────────────────────── */
.cta-block {
  position: relative;
  background: var(--color-surface-1);
  border: 1.5px solid var(--color-border-strong);
  border-radius: 12px;
  padding: 24px;
  overflow: hidden;
  animation: fade-up 0.45s ease 0.22s both;
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
  animation: fade-up 0.45s ease 0.05s both;
}
.preview-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-2);
}

/* ── Next / recap card ──────────────────────────────────────────── */
.next-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 20px;
  animation: fade-up 0.45s ease 0.12s both;
}
.next-step {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 12px;
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

/* ── Confirmation ───────────────────────────────────────────────── */
.confirmed-card { animation: fade-up 0.6s ease both; }

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
  .config-card, .cta-block, .preview-card,
  .next-card, .confirmed-card { animation: none; }
  .config-accent, .config-badge, .next-step { transition: none; }
}
</style>
