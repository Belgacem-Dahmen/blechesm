<template>
  <AdminLayout>

    <!-- ── LOADING ──────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex justify-center py-20">
      <BlechEsmLoader size="64px" label="Chargement…" />
    </div>

    <!-- ── NOT FOUND ─────────────────────────────────────────────────── -->
    <div v-else-if="!request" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-14 h-14 rounded-xl bg-surface-2 border border-border flex items-center justify-center mb-4">
        <FileX class="w-6 h-6 text-text-3" />
      </div>
      <p class="text-text font-medium mb-1">Demande introuvable</p>
      <p class="text-text-3 text-sm mb-5">L'identifiant ne correspond à aucune demande.</p>
      <RouterLink to="/admin/demandes">
        <BaseButton variant="secondary" size="sm">
          <ArrowLeft class="w-3.5 h-3.5" /> Retour aux demandes
        </BaseButton>
      </RouterLink>
    </div>

    <!-- ── CONTENT ───────────────────────────────────────────────────── -->
    <div v-else class="space-y-6">

      <!-- Breadcrumb -->
      <RouterLink to="/admin/demandes" class="inline-flex items-center gap-1.5 text-text-3 text-xs hover:text-text transition-colors">
        <ArrowLeft class="w-3.5 h-3.5" />
        Retour aux demandes
      </RouterLink>

      <!-- Header -->
      <div class="flex flex-wrap gap-3 items-start justify-between pb-5 border-b border-border">
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2 mb-1.5">
            <span class="text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border"
              :style="serviceStyle(request.serviceType)">
              {{ serviceLabel(request.serviceType) }}
            </span>
            <span class="text-text-3 text-xs font-mono">{{ request.id }}</span>
          </div>
          <h1 class="font-display font-semibold text-text text-2xl leading-tight">{{ request.client.name }}</h1>
          <p class="text-text-3 text-sm mt-0.5">
            <Clock class="w-3.5 h-3.5 inline -mt-0.5 mr-1" />
            {{ formatDateLong(request.createdAt) }}
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <div class="status-dot" :style="{ background: statusMap[request.status]?.dot ?? '#94A3B8' }" />
          <span class="text-sm font-medium" :style="{ color: statusMap[request.status]?.dot }">
            {{ statusMap[request.status]?.label }}
          </span>
        </div>
      </div>

      <!-- Key metrics row -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="metric-card">
          <p class="metric-label">Service</p>
          <p class="metric-value">{{ serviceLabel(request.serviceType) }}</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">Budget client</p>
          <p class="metric-value text-warning">{{ request.budget ?? '—' }}</p>
        </div>
        <div class="metric-card">
          <p class="metric-label">Surface</p>
          <p class="metric-value font-mono">
            <template v-if="request.wall.width && request.wall.height">
              {{ request.wall.width }}×{{ request.wall.height }} m
              <span class="text-text-3 font-sans text-xs ml-1">({{ (request.wall.width * request.wall.height).toFixed(1) }} m²)</span>
            </template>
            <template v-else>—</template>
          </p>
        </div>
        <div class="metric-card">
          <p class="metric-label">Prix établi</p>
          <p class="metric-value" :class="request.finalPrice ? 'text-success' : 'text-text-3'">
            {{ request.finalPrice ? `${request.finalPrice.toLocaleString('fr-FR')} DT` : 'Non établi' }}
          </p>
        </div>
      </div>

      <!-- Main grid -->
      <div class="grid lg:grid-cols-5 gap-6 items-start">

        <!-- ── LEFT ────────────────────────────────────────────────── -->
        <div class="lg:col-span-3 space-y-4">

          <!-- Generated image (hero) -->
          <div v-if="request.generatedImage" class="section-card">
            <div class="section-label">
              <Sparkles class="w-3.5 h-3.5" />
              Fresque générée par IA
              <span class="ml-auto text-[10px] font-mono opacity-50">Gemini AI</span>
            </div>
            <div class="aspect-video overflow-hidden rounded-lg bg-surface-2 relative">
              <img :src="request.generatedImage" alt="Fresque IA" class="w-full h-full object-cover" />
              <div class="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold font-mono text-bg"
                style="background:#4ADE80; box-shadow:0 0 10px rgba(74,222,128,0.4)">
                <Sparkles class="w-3 h-3" /> IA
              </div>
            </div>
          </div>

          <!-- Wall + reference side by side -->
          <div class="grid sm:grid-cols-2 gap-4">
            <div v-if="request.wallPhoto" class="section-card">
              <div class="section-label"><ImageIcon class="w-3.5 h-3.5" /> Photo du mur</div>
              <div class="aspect-video overflow-hidden rounded-lg bg-surface-2">
                <img :src="request.wallPhoto" alt="Mur" class="w-full h-full object-cover" />
              </div>
            </div>
            <div v-if="request.referencePhoto" class="section-card">
              <div class="section-label"><BookImage class="w-3.5 h-3.5" /> Image de référence</div>
              <div class="aspect-video overflow-hidden rounded-lg bg-surface-2">
                <img :src="request.referencePhoto" alt="Référence" class="w-full h-full object-cover" />
              </div>
            </div>
            <!-- Placeholder if no photos at all -->
            <div v-if="!request.wallPhoto && !request.referencePhoto"
              class="sm:col-span-2 aspect-video rounded-lg border border-dashed border-border flex items-center justify-center text-text-3 text-sm">
              <div class="text-center">
                <ImageIcon class="w-8 h-8 opacity-20 mx-auto mb-2" />
                Aucune photo importée
              </div>
            </div>
          </div>

          <!-- Description -->
          <div v-if="request.wall.description" class="section-card">
            <div class="section-label"><AlignLeft class="w-3.5 h-3.5" /> Description du projet</div>
            <p class="text-text-2 text-sm leading-relaxed">{{ request.wall.description }}</p>
          </div>

          <!-- Messages thread -->
          <div class="section-card">
            <div class="section-label">
              <MessageSquare class="w-3.5 h-3.5" />
              Messages
              <span v-if="request.messages.length" class="ml-1.5 px-1.5 py-0.5 rounded-full bg-accent/15 text-accent text-[10px] font-bold">
                {{ request.messages.length }}
              </span>
            </div>

            <!-- Thread -->
            <div v-if="request.messages.length" class="space-y-3 mb-4 max-h-72 overflow-y-auto pr-1">
              <div v-for="msg in request.messages" :key="msg.id"
                :class="['flex gap-3', msg.fromRole === 'admin' ? 'flex-row-reverse' : '']">
                <div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  :class="msg.fromRole === 'admin' ? 'bg-accent/20 text-accent' : 'bg-surface-3 text-text-3'">
                  {{ msg.fromRole === 'admin' ? 'A' : 'C' }}
                </div>
                <div class="max-w-[75%]">
                  <div :class="['px-3 py-2 rounded-xl text-sm leading-relaxed',
                    msg.fromRole === 'admin'
                      ? 'bg-accent/10 border border-accent/20 text-text rounded-tr-sm'
                      : 'bg-surface-2 border border-border text-text-2 rounded-tl-sm']">
                    {{ msg.content }}
                  </div>
                  <p class="text-text-3 text-[10px] mt-1 font-mono" :class="msg.fromRole === 'admin' ? 'text-right' : ''">
                    {{ msg.fromRole === 'admin' ? 'Admin' : request.client.name }} · {{ formatTime(msg.createdAt) }}
                  </p>
                </div>
              </div>
            </div>
            <div v-else class="text-text-3 text-xs text-center py-4 border border-dashed border-border rounded-lg mb-4">
              Aucun message pour cette demande
            </div>

            <!-- Send message -->
            <div class="flex gap-2">
              <input
                v-model="newMessage"
                placeholder="Écrire un message au client…"
                class="flex-1 bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
                @keydown.enter.prevent="handleSendMessage"
              />
              <button
                @click="handleSendMessage"
                :disabled="!newMessage.trim() || sendingMsg"
                class="px-4 py-2.5 rounded-lg bg-accent text-white text-sm font-medium transition-opacity disabled:opacity-40 hover:opacity-90 shrink-0 flex items-center gap-1.5"
              >
                <Send class="w-3.5 h-3.5" />
                {{ sendingMsg ? '…' : 'Envoyer' }}
              </button>
            </div>
          </div>

        </div>

        <!-- ── RIGHT ───────────────────────────────────────────────── -->
        <div class="lg:col-span-2 space-y-4 lg:sticky lg:top-24">

          <!-- Client card -->
          <div class="section-card">
            <div class="section-label"><User class="w-3.5 h-3.5" /> Coordonnées client</div>
            <div class="space-y-3">
              <div class="contact-row">
                <div class="contact-icon"><User class="w-3.5 h-3.5" /></div>
                <div>
                  <p class="text-[10px] text-text-3 font-mono uppercase tracking-wider">Nom</p>
                  <p class="text-text text-sm font-medium">{{ request.client.name }}</p>
                </div>
              </div>
              <div class="contact-row">
                <div class="contact-icon"><Mail class="w-3.5 h-3.5" /></div>
                <div>
                  <p class="text-[10px] text-text-3 font-mono uppercase tracking-wider">Email</p>
                  <a :href="`mailto:${request.client.email}`" class="text-accent text-sm hover:underline">{{ request.client.email }}</a>
                </div>
              </div>
              <div v-if="request.client.phone" class="contact-row">
                <div class="contact-icon"><Phone class="w-3.5 h-3.5" /></div>
                <div>
                  <p class="text-[10px] text-text-3 font-mono uppercase tracking-wider">Téléphone</p>
                  <a :href="`tel:${request.client.phone}`" class="text-text text-sm hover:underline">{{ request.client.phone }}</a>
                </div>
              </div>
              <div v-if="request.client.city" class="contact-row">
                <div class="contact-icon"><MapPin class="w-3.5 h-3.5" /></div>
                <div>
                  <p class="text-[10px] text-text-3 font-mono uppercase tracking-wider">Ville</p>
                  <p class="text-text text-sm">{{ request.client.city }}</p>
                </div>
              </div>
            </div>
            <div class="flex gap-2 mt-4 pt-4 border-t border-border">
              <a :href="`mailto:${request.client.email}`"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 border border-border text-text-2 text-xs font-medium hover:border-accent hover:text-accent transition-colors">
                <Mail class="w-3.5 h-3.5" /> Email
              </a>
              <a v-if="request.client.phone" :href="`tel:${request.client.phone}`"
                class="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 border border-border text-text-2 text-xs font-medium hover:border-success hover:text-success transition-colors">
                <Phone class="w-3.5 h-3.5" /> Appeler
              </a>
            </div>
          </div>

          <!-- Edit card -->
          <div class="section-card">
            <div class="section-label"><Settings class="w-3.5 h-3.5" /> Gestion de la demande</div>
            <form @submit.prevent="handleSave" class="space-y-4">

              <!-- Status -->
              <div>
                <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Statut</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="s in statusOptions"
                    :key="s.value"
                    type="button"
                    @click="editable.status = s.value"
                    :class="['status-btn', editable.status === s.value ? 'status-btn--active' : '']"
                    :style="editable.status === s.value ? { '--sb': s.dot, borderColor: s.dot, color: s.dot, background: s.dot + '15' } : {}"
                  >
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :style="{ background: s.dot }" />
                    {{ s.label }}
                  </button>
                </div>
              </div>

              <!-- Final price -->
              <div>
                <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Prix final (DT)</label>
                <div class="relative">
                  <input
                    v-model="editable.finalPrice"
                    type="number"
                    min="0"
                    placeholder="ex. 3 500"
                    class="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors pr-10"
                  />
                  <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-3 text-xs font-mono">DT</span>
                </div>
                <p class="text-text-3 text-[10px] mt-1 font-mono">
                  Budget annoncé : <span class="text-warning">{{ request.budget ?? 'non renseigné' }}</span>
                </p>
              </div>

              <!-- Internal notes -->
              <div>
                <label class="block text-xs text-text-3 mb-1.5 font-mono uppercase tracking-wider">Notes internes</label>
                <textarea
                  v-model="editable.internalNotes"
                  rows="4"
                  placeholder="Commentaires, prochaines étapes, infos logistiques…"
                  class="w-full bg-surface-2 border border-border rounded-lg px-3.5 py-2.5 text-sm text-text placeholder-text-3 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none"
                />
              </div>

              <div class="flex items-center gap-3 pt-1">
                <BaseButton type="submit" size="sm" :loading="saving" class="flex-1">
                  <Save class="w-3.5 h-3.5" /> Enregistrer
                </BaseButton>
                <Transition name="fade">
                  <span v-if="savedOk" class="flex items-center gap-1.5 text-success text-xs font-medium shrink-0">
                    <CheckCircle2 class="w-4 h-4" /> Enregistré
                  </span>
                </Transition>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  ArrowLeft, CheckCircle2, Clock, Sparkles, ImageIcon,
  MessageSquare, Send, User, Mail, Phone, MapPin,
  AlignLeft, Settings, Save, FileX, BookImage,
} from 'lucide-vue-next'
import { getRequest, updateRequest, sendMessage } from '@/mocks/api.js'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BlechEsmLoader from '@/components/ui/BlechEsmLoader.vue'

const route = useRoute()
const request = ref(null)
const loading  = ref(true)
const saving   = ref(false)
const savedOk  = ref(false)
const sendingMsg = ref(false)
const newMessage = ref('')
const editable = reactive({ status: '', finalPrice: '', internalNotes: '' })

const statusMap = {
  nouveau:  { label: 'Nouveau',  dot: '#3D7BFF' },
  en_cours: { label: 'En cours', dot: '#F6B84E' },
  traite:   { label: 'Traité',   dot: '#4ADE80' },
  annule:   { label: 'Annulé',   dot: '#F87171' },
}

const statusOptions = [
  { value: 'nouveau',  label: 'Nouveau',  dot: '#3D7BFF' },
  { value: 'en_cours', label: 'En cours', dot: '#F6B84E' },
  { value: 'traite',   label: 'Traité',   dot: '#4ADE80' },
  { value: 'annule',   label: 'Annulé',   dot: '#F87171' },
]

const serviceMap = {
  mural:      { label: 'Dessin Mural',  color: '#3D7BFF' },
  sculpture:  { label: 'Sculpture 3D',  color: '#A78BFA' },
  sol:        { label: 'Design Sol',    color: '#FF6B35' },
}

function serviceLabel(t) { return serviceMap[t]?.label ?? t }
function serviceStyle(t) {
  const c = serviceMap[t]?.color ?? '#94A3B8'
  return { color: c, borderColor: c + '50', background: c + '12' }
}

onMounted(async () => {
  try {
    const data = await getRequest(route.params.id)
    request.value = data
    editable.status       = data.status
    editable.finalPrice   = data.finalPrice ?? ''
    editable.internalNotes = data.internalNotes ?? ''
  } finally {
    loading.value = false
  }
})

async function handleSave() {
  saving.value = true
  try {
    const updated = await updateRequest(route.params.id, {
      status: editable.status,
      ...(editable.finalPrice !== '' ? { finalPrice: Number(editable.finalPrice) } : {}),
      internalNotes: editable.internalNotes,
    })
    request.value = updated
    savedOk.value = true
    setTimeout(() => (savedOk.value = false), 2500)
  } finally {
    saving.value = false
  }
}

async function handleSendMessage() {
  const text = newMessage.value.trim()
  if (!text || sendingMsg.value) return
  sendingMsg.value = true
  try {
    const msg = await sendMessage(route.params.id, text)
    request.value.messages.push(msg)
    newMessage.value = ''
  } finally {
    sendingMsg.value = false
  }
}

function formatDateLong(iso) {
  return new Date(iso).toLocaleDateString('fr-FR', { dateStyle: 'long' })
}
function formatTime(iso) {
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
/* ── Section cards ──────────────────────────────────────────────── */
.section-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 18px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-3);
  margin-bottom: 14px;
}

/* ── Metric cards ───────────────────────────────────────────────── */
.metric-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 12px 14px;
}
.metric-label {
  font-size: 10px;
  font-family: var(--font-mono);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-3);
  margin-bottom: 4px;
}
.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text);
}

/* ── Status dot ─────────────────────────────────────────────────── */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
  flex-shrink: 0;
}

/* ── Status buttons ─────────────────────────────────────────────── */
.status-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 7px;
  border: 1.5px solid var(--color-border-strong);
  background: var(--color-surface-2);
  color: var(--color-text-3);
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.status-btn:hover { color: var(--color-text); border-color: var(--color-text-3); }
.status-btn--active { font-weight: 600; }

/* ── Contact rows ───────────────────────────────────────────────── */
.contact-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.contact-icon {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border-strong);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-3);
  flex-shrink: 0;
}

/* ── Fade ───────────────────────────────────────────────────────── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
