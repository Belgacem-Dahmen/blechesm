<template>
  <div class="bg-bg min-h-screen text-text overflow-x-hidden">
    <NavBar />

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative pt-24 pb-28 overflow-hidden hero-section">
      <div class="absolute inset-0 grid-bg opacity-[0.07] pointer-events-none" />
      <div class="spray spray-pink absolute -top-12 -right-12 w-[260px] h-[260px]" style="opacity:0.045" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-start justify-between gap-8">

          <div class="max-w-2xl">
            <!-- Eyebrow -->
            <div class="flex items-center gap-3 mb-6 h-eyebrow">
              <span class="w-6 h-px bg-accent" />
              <span class="text-xs font-mono uppercase tracking-widest text-accent">Contact</span>
              <svg width="56" height="24" viewBox="0 0 56 24" class="text-warning opacity-65 hidden sm:block" fill="none" aria-hidden="true">
                <path d="M4,12 C14,4 32,4 46,12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M40,7 L47,13 L39,17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tightest leading-[0.9] mb-6 h-title">
              Parlons de<br />
              <span class="relative inline-block text-accent">
                votre projet
                <svg class="absolute -bottom-1 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none" fill="none" aria-hidden="true">
                  <path d="M0,4 Q40,0 80,4 Q120,8 160,4 Q200,0 240,4 Q280,8 300,4" stroke="#FF6B35" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>
                </svg>
              </span>
            </h1>

            <p class="text-text-2 text-lg leading-relaxed h-sub">
              Une question, un projet à discuter, ou simplement envie d'échanger ?<br class="hidden sm:block" />
              Notre équipe vous répond sous 24h.
            </p>
          </div>

          <!-- Desktop stickers -->
          <div class="hidden lg:flex flex-col items-end gap-3 pt-16 shrink-0 h-stickers">
            <svg width="28" height="64" viewBox="0 0 28 64" class="text-text-3 opacity-40 mb-1" fill="none" aria-hidden="true">
              <path d="M14,4 C14,22 6,36 14,56" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="3 4"/>
              <path d="M8,50 L14,58 L20,50" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div
              v-for="(s, i) in stickers"
              :key="s.label"
              class="sticker"
              :style="{ '--sc': s.color, transform: `rotate(${s.rotate}deg)`, animationDelay: `${0.3 + i * 0.09}s` }"
            >{{ s.label }}</div>
          </div>
        </div>
      </div>

    </section>

    <!-- ── MAIN CONTENT ──────────────────────────────────────────────── -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div class="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

        <!-- ── LEFT: FORM ──────────────────────────────────────────── -->
        <div class="lg:col-span-3 form-col">
          <Transition name="fade" mode="out-in">

            <!-- Success state -->
            <div v-if="sent" key="success" class="success-card">
              <div class="spray spray-green absolute -top-20 -right-20 w-64 h-64" />
              <div class="relative z-10 flex flex-col items-center text-center py-4">
                <div class="w-20 h-20 rounded-full bg-success/15 border border-success/30 flex items-center justify-center mb-6">
                  <CheckCircle2 class="w-10 h-10 text-success" />
                </div>
                <Pill class="mb-4 mx-auto">Envoyé !</Pill>
                <h2 class="font-display font-semibold text-text text-2xl mb-3">Message bien reçu !</h2>
                <p class="text-text-2 text-sm leading-relaxed mb-6 max-w-xs">
                  Nous vous répondrons à <strong class="text-text">{{ form.email }}</strong> dans les 24 heures ouvrées.
                </p>
                <div class="flex flex-col gap-2.5 items-center">
                  <RouterLink to="/portfolio">
                    <BaseButton variant="secondary" size="md">Voir le portfolio →</BaseButton>
                  </RouterLink>
                  <button @click="reset" class="text-accent text-xs hover:underline mt-1">Envoyer un autre message</button>
                </div>
              </div>
            </div>

            <!-- Form -->
            <form v-else key="form" @submit.prevent="handleSubmit" novalidate class="space-y-4">

              <!-- Card 1: identité -->
              <div class="form-card" :class="nameEmailDone ? 'form-card--done' : ''">
                <div class="flex items-start gap-3 mb-5">
                  <div class="step-badge" :class="nameEmailDone ? 'step-badge--done' : ''">
                    <Check v-if="nameEmailDone" class="w-4 h-4" />
                    <span v-else>1</span>
                  </div>
                  <div>
                    <h3 class="font-display font-semibold text-text">Votre identité</h3>
                    <p class="text-text-3 text-xs mt-0.5">Pour que nous sachions à qui répondre</p>
                  </div>
                </div>
                <div class="grid sm:grid-cols-2 gap-4">
                  <BaseInput v-model="form.name"  label="Nom complet" placeholder="Votre nom" required :error="errors.name" />
                  <BaseInput v-model="form.email" type="email" label="Email" placeholder="vous@exemple.fr" required :error="errors.email" />
                </div>
              </div>

              <!-- Card 2: sujet + message -->
              <div class="form-card" :class="messageDone ? 'form-card--done' : ''">
                <div class="flex items-start gap-3 mb-5">
                  <div class="step-badge" :class="messageDone ? 'step-badge--done' : 'step-badge--idle'">
                    <Check v-if="messageDone" class="w-4 h-4" />
                    <span v-else>2</span>
                  </div>
                  <div>
                    <h3 class="font-display font-semibold text-text">Votre message</h3>
                    <p class="text-text-3 text-xs mt-0.5">Plus c'est précis, mieux on peut vous aider</p>
                  </div>
                </div>
                <div class="space-y-4">
                  <BaseInput v-model="form.subject" label="Sujet" placeholder="Projet de fresque, question tarifaire, visite atelier…" />
                  <BaseInput
                    v-model="form.message"
                    type="textarea"
                    label="Message"
                    placeholder="Décrivez votre projet, votre mur, vos idées… Toute information nous aide à mieux vous répondre."
                    :rows="5"
                    required
                    :error="errors.message"
                  />
                  <div class="flex items-center justify-between">
                    <span class="text-text-3 text-xs font-mono">{{ form.message.length }} car.</span>
                    <span class="text-xs transition-colors" :class="form.message.length >= 30 ? 'text-success' : 'text-text-3'">
                      {{ form.message.length >= 30 ? '✓ Bonne longueur' : 'Min. 30 recommandés' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- CTA block -->
              <div class="bg-surface-1 border border-border rounded-xl p-5">
                <div class="flex flex-col sm:flex-row gap-3 items-center">
                  <BaseButton type="submit" size="lg" :loading="submitting" class="w-full sm:flex-1">
                    <Send class="w-4 h-4" />
                    Envoyer le message →
                  </BaseButton>
                  <div class="text-center sm:text-left">
                    <p class="text-text-3 text-xs">Réponse sous 24h</p>
                    <p class="text-text-3 text-xs">Sans engagement</p>
                  </div>
                </div>

                <!-- Completion indicators -->
                <div class="mt-4 pt-4 border-t border-border flex flex-wrap gap-4">
                  <div class="flex items-center gap-1.5 text-xs" :class="form.name ? 'text-success' : 'text-text-3'">
                    <CheckCircle2 v-if="form.name" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Nom
                  </div>
                  <div class="flex items-center gap-1.5 text-xs" :class="form.email ? 'text-success' : 'text-text-3'">
                    <CheckCircle2 v-if="form.email" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Email
                  </div>
                  <div class="flex items-center gap-1.5 text-xs" :class="form.message.length >= 10 ? 'text-success' : 'text-text-3'">
                    <CheckCircle2 v-if="form.message.length >= 10" class="w-3.5 h-3.5" />
                    <Circle v-else class="w-3.5 h-3.5" />
                    Message
                  </div>
                </div>
              </div>
            </form>
          </Transition>
        </div>

        <!-- ── RIGHT: INFO SIDEBAR ─────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-4 lg:sticky lg:top-24 info-col">

          <!-- Contact cards -->
          <div
            v-for="info in contactInfo"
            :key="info.title"
            class="info-card"
            :style="{ '--ic': info.color }"
          >
            <div class="info-icon-wrap">
              <component :is="info.icon" class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-display font-semibold text-text text-sm">{{ info.title }}</p>
              <p class="text-text-2 text-sm mt-0.5 leading-relaxed">{{ info.value }}</p>
              <a
                v-if="info.link"
                :href="info.link"
                class="text-xs mt-1 inline-flex items-center gap-1 hover:underline"
                :style="{ color: info.color }"
                target="_blank"
                rel="noopener"
              >
                {{ info.linkLabel }}
                <ArrowRight class="w-3 h-3" />
              </a>
            </div>
          </div>

          <!-- Zone map placeholder (graffiti-styled) -->
          <div class="map-block">
            <div class="spray spray-cyan absolute inset-0 w-full h-full rounded-xl opacity-[0.06]" style="filter:blur(40px)" />
            <div class="relative z-10 flex flex-col items-center justify-center gap-3 text-center py-4">
              <div class="w-12 h-12 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-accent">
                <MapPin class="w-6 h-6" />
              </div>
              <div>
                <p class="font-display font-semibold text-text text-sm">Tunisie & Maghreb</p>
                <p class="text-text-3 text-xs mt-0.5">Nous nous déplaçons partout</p>
              </div>
              <!-- Mini France outline -->
              <div class="flex flex-wrap gap-1.5 justify-center mt-1">
                <span v-for="city in cities" :key="city.name"
                  class="text-xs px-2 py-0.5 rounded-pill border font-mono"
                  :style="{ color: city.color, borderColor: city.color + '50', background: city.color + '12' }"
                >{{ city.name }}</span>
              </div>
            </div>
          </div>

          <!-- Response promise -->
          <div class="bg-surface-1 border border-border rounded-xl p-5 space-y-3">
            <p class="font-display font-semibold text-text text-sm mb-1">Notre engagement</p>
            <div v-for="p in promises" :key="p.text" class="flex items-center gap-3">
              <component :is="p.icon" class="w-4 h-4 text-accent shrink-0" />
              <span class="text-text-2 text-xs leading-relaxed">{{ p.text }}</span>
            </div>
          </div>
        </div>

      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  MapPin, Mail, Phone, Instagram,
  CheckCircle2, Circle, Check, Send, ArrowRight,
  Clock, Shield, MessageCircle,
} from 'lucide-vue-next'
import NavBar from '@/components/layout/NavBar.vue'
import Footer from '@/components/layout/Footer.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import Pill from '@/components/ui/Pill.vue'

const submitting = ref(false)
const sent = ref(false)
const form = reactive({ name: '', email: '', subject: '', message: '' })
const errors = reactive({ name: '', email: '', message: '' })

const nameEmailDone = computed(() => !!form.name && !!form.email)
const messageDone   = computed(() => form.message.length >= 10)

const stickers = [
  { label: 'Tunis — Tunisie', color: '#FB923C', rotate: -3 },
  { label: 'Réponse 24h',     color: '#4ADE80', rotate:  2 },
  { label: 'Gratuit',         color: '#F472B6', rotate: -2 },
  { label: 'Art Mural',       color: '#22D3EE', rotate:  3 },
  { label: 'Devis Offert',    color: '#A78BFA', rotate: -1 },
]

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'blechesmcom@gmail.com',
    color: '#3D7BFF',
    link: 'mailto:blechesmcom@gmail.com',
    linkLabel: 'Écrire un email',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+216 50 133 961',
    color: '#4ADE80',
    link: 'tel:+21650133961',
    linkLabel: 'Appeler maintenant',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    value: '@blech.esm — suivez nos créations en direct',
    color: '#F472B6',
    link: 'https://www.instagram.com/blech.esm/',
    linkLabel: 'Voir le compte',
  },
  {
    icon: MapPin,
    title: 'Zone d\'intervention',
    value: '112 Rue de La Palestine, Tunis, 1002 — Tunisie & Maghreb.',
    color: '#FB923C',
    link: null,
    linkLabel: null,
  },
]

const cities = [
  { name: 'Tunis',    color: '#3D7BFF' },
  { name: 'Sfax',     color: '#4ADE80' },
  { name: 'Sousse',   color: '#FB923C' },
  { name: 'Bizerte',  color: '#F472B6' },
  { name: 'Nabeul',   color: '#22D3EE' },
  { name: 'Hammamet', color: '#A78BFA' },
]

const promises = [
  { icon: Clock,         text: 'Réponse garantie sous 24h ouvrées' },
  { icon: Shield,        text: 'Échange confidentiel, sans engagement' },
  { icon: MessageCircle, text: 'Conseils gratuits sur votre projet mural' },
]

function reset() {
  sent.value = false
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
  Object.assign(errors, { name: '', email: '', message: '' })
}

async function handleSubmit() {
  Object.keys(errors).forEach(k => errors[k] = '')
  let valid = true
  if (!form.name)    { errors.name    = 'Requis'; valid = false }
  if (!form.email)   { errors.email   = 'Requis'; valid = false }
  if (!form.message) { errors.message = 'Requis'; valid = false }
  if (!valid) return

  submitting.value = true
  await new Promise(r => setTimeout(r, 900))
  submitting.value = false
  sent.value = true
}
</script>

<style scoped>
/* ── Utils ──────────────────────────────────────────────────────── */
.no-scrollbar { scrollbar-width: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }

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

/* ── Hero animations ────────────────────────────────────────────── */
.h-eyebrow  { animation: fade-up 0.5s ease 0.05s both; }
.h-title    { animation: fade-up 0.65s ease 0.15s both; }
.h-sub      { animation: fade-up 0.55s ease 0.3s both; }
.h-stickers { animation: fade-left 0.7s ease 0.2s both; }
.form-col   { animation: fade-up 0.5s ease 0.1s both; }
.info-col   { animation: fade-up 0.5s ease 0.2s both; }

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
.sticker:hover {
  box-shadow: 0 0 16px color-mix(in srgb, var(--sc) 40%, transparent);
}

/* ── Form cards (step cards) ────────────────────────────────────── */
.form-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-card--done {
  border-color: rgba(61, 123, 255, 0.3);
  box-shadow: 0 0 0 1px rgba(61, 123, 255, 0.12);
}

/* Step badge */
.step-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  flex-shrink: 0;
  transition: background 0.2s, color 0.2s;
  background: #3D7BFF;
  color: #fff;
}
.step-badge--done {
  background: var(--color-success);
  color: var(--color-bg);
}
.step-badge--idle {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-strong);
  color: var(--color-text-2);
}

/* ── Success card ───────────────────────────────────────────────── */
.success-card {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 40px 32px;
  animation: fade-up 0.4s ease both;
}

/* ── Info cards ─────────────────────────────────────────────────── */
.info-card {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  transition: border-color 0.2s, transform 0.2s;
}
.info-card:hover {
  border-color: var(--ic);
  transform: translateX(3px);
}
.info-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: color-mix(in srgb, var(--ic) 12%, transparent);
  color: var(--ic);
  border: 1px solid color-mix(in srgb, var(--ic) 25%, transparent);
  transition: background 0.2s, transform 0.2s;
}
.info-card:hover .info-icon-wrap {
  background: color-mix(in srgb, var(--ic) 20%, transparent);
  transform: scale(1.08);
}

/* ── Map block ──────────────────────────────────────────────────── */
.map-block {
  position: relative;
  overflow: hidden;
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 24px;
}

/* ── Fade transition ────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from,  .fade-leave-to      { opacity: 0; }

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
  .h-eyebrow, .h-title, .h-sub, .h-stickers,
  .sticker, .form-col, .info-col, .success-card { animation: none; }
  .info-card, .info-icon-wrap { transition: none; }
}
</style>
