<template>
  <div class="bg-bg min-h-screen text-text flex flex-col h-screen overflow-hidden">
    <NavBar />

    <div class="flex flex-1 pt-16 overflow-hidden">
      <!-- ── Chat column ─────────────────────────────────────────────── -->
      <main class="flex flex-1 flex-col min-h-0 min-w-0 relative">
        <!-- Ambient background blobs -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div class="blob blob-1" />
          <div class="blob blob-2" />
          <div class="blob blob-3" />
        </div>

        <!-- Messages scroll area -->
        <div
          ref="scrollEl"
          class="flex-1 overflow-y-auto relative z-10 chat-scroll"
        >
          <div class="max-w-2xl mx-auto w-full pl-1 pr-2 py-8 pb-4 space-y-0">
            <ChatMessage
              v-for="msg in flow.messages.value"
              :key="msg.id"
              :message="msg"
              :is-latest-result="msg.id === latestResultId"
              @pick-service="flow.pickService"
              @submit-photo="handleSubmitPhoto"
              @skip-photo="handleSkipPhoto"
              @submit-chips="handleChip"
              @submit-dimensions="({ w, h }) => flow.submitDimensions(w, h)"
              @submit-contact="flow.submitContact"
              @generate="handleGenerate"
              @modify="handleModify"
              @regenerate="handleRegenerate"
              @validate="handleValidate"
              @download="handleDownload"
            />

            <!-- Bottom anchor for scroll -->
            <div ref="bottomAnchor" class="h-4" />
          </div>
        </div>

        <!-- Input bar -->
        <div class="relative z-10">
          <ChatInput
            :phase="flow.phase.value"
            :disabled="flow.isTyping.value || flow.phase.value === 'generating'"
            @send="handleSend"
            @send-file="handleSendFile"
          />
        </div>
      </main>

      <!-- ── Config panel (lg+ only) ─────────────────────────────────── -->
      <Motion
        as="aside"
        :initial="{ opacity: 0, x: 40 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.6, ease: EASE, delay: 0.25 }"
        class="hidden lg:flex flex-col w-72 xl:w-80 border-l border-border bg-surface-1 shrink-0 overflow-y-auto chat-scroll"
      >
        <div class="sticky top-0 z-10 px-5 py-3 border-b border-border bg-surface-1/95 backdrop-blur-sm">
          <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Récapitulatif</p>
        </div>
        <ConfigPanel
          :data="flow.collectedData.value"
          :phase="flow.phase.value"
          :service-color="serviceColor"
        />
      </Motion>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Motion } from 'motion-v'
import NavBar from '@/components/layout/NavBar.vue'
import ChatMessage from '@/components/chat/ChatMessage.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import ConfigPanel from '@/components/chat/ConfigPanel.vue'
import { useChatFlow, SERVICE_DEFS } from '@/composables/useChatFlow.js'
import { useRequestStore } from '@/stores/request.js'
import { generateFresco, submitQuote } from '@/mocks/api.js'
import { EASE } from '@/utils/motion.js'

const route  = useRoute()
const router = useRouter()
const store  = useRequestStore()
const flow   = useChatFlow()

const scrollEl    = ref(null)
const bottomAnchor = ref(null)

// ── Service color ────────────────────────────────────────────────────────────

const serviceColor = computed(() => {
  const svc = SERVICE_DEFS.find(s => s.id === flow.pickedService.value)
  return svc?.color ?? '#3D7BFF'
})

// ── Latest result message id (for action buttons) ────────────────────────────

const latestResultId = computed(() => {
  const results = flow.messages.value.filter(m => m.type === 'result_image')
  return results.length > 0 ? results[results.length - 1].id : null
})

// ── Auto-scroll ───────────────────────────────────────────────────────────────

function scrollToBottom() {
  nextTick(() => {
    if (scrollEl.value) {
      scrollEl.value.scrollTop = scrollEl.value.scrollHeight
    }
  })
}

watch(() => flow.messages.value.length, scrollToBottom)
watch(() => flow.isTyping.value, scrollToBottom)

// ── Init ──────────────────────────────────────────────────────────────────────

onMounted(async () => {
  store.reset()
  await flow.init(route.query.service)
})

watch(() => route.query.service, async (newService) => {
  if (newService && ['mural', 'sculpture', 'sol'].includes(newService)) {
    store.reset()
    await flow.init(newService)
  }
})

// ── Event handlers ────────────────────────────────────────────────────────────

async function handleSubmitPhoto({ file, role }) {
  if (role === 'wall' && flow.phase.value !== 'photo') return
  if (role === 'ref'  && flow.phase.value !== 'ref_photo') return
  await flow.submitPhoto(file, role)
}

function handleSkipPhoto() {
  if (flow.phase.value !== 'ref_photo') return
  flow.skipRefPhoto()
}

async function handleChip(text) {
  if (flow.phase.value === 'questions') {
    await flow.submitAnswer(text)
  }
}

async function handleSend(text) {
  if (!text?.trim()) return
  if (flow.phase.value === 'modify') {
    await flow.submitModification(text)
    await _runGeneration()
  } else if (flow.phase.value === 'questions') {
    await flow.submitAnswer(text)
  }
}

async function handleSendFile(file) {
  if (flow.phase.value === 'photo') {
    await flow.submitPhoto(file, 'wall')
  } else if (flow.phase.value === 'ref_photo') {
    await flow.submitPhoto(file, 'ref')
  }
}

async function handleGenerate() {
  await _runGeneration()
}

async function handleModify() {
  await flow.startModify()
}

async function handleRegenerate() {
  flow.reGenerate()
  await _runGeneration()
}

async function handleValidate() {
  try {
    const res = await submitQuote({
      ...store.dimensions,
      ...store.contact,
      serviceType:     store.serviceType,
      description:     store.description,
      wallPhoto:       store.wallPhoto,
      referencePhoto:  store.referencePhoto,
      generatedImage:  store.generatedImage,
    })
    store.submitted = true
    store.requestId = res?.id ?? null
    router.push('/resultat')
  } catch (e) {
    console.error('Erreur soumission :', e)
  }
}

function handleDownload() {
  const url = store.generatedImage
  if (!url) return
  const a = document.createElement('a')
  a.href = url
  a.download = 'blechesm-visualisation.jpg'
  a.click()
}

// ── Generation helper ─────────────────────────────────────────────────────────

async function _runGeneration() {
  flow.startGenerating()
  scrollToBottom()
  try {
    const url = await generateFresco(
      store.wallPhoto ?? store.referencePhoto,
      store.referencePhoto,
      store.description,
      store.serviceType,
    )
    flow.onGenerationDone(url)
  } catch (e) {
    flow.onGenerationError(e?.message || 'La génération a échoué. Veuillez réessayer.')
  }
  scrollToBottom()
}
</script>

<style scoped>
/* Ambient atmospheric blobs — slowly drift to create depth */
@keyframes blob-drift-a {
  0%, 100% { transform: translate(0, 0) scale(1); }
  40%       { transform: translate(28px, -20px) scale(1.08); }
  70%       { transform: translate(-16px, 18px) scale(0.93); }
}

@keyframes blob-drift-b {
  0%, 100% { transform: translate(0, 0) scale(1); }
  35%       { transform: translate(-22px, 14px) scale(1.05); }
  65%       { transform: translate(18px, -24px) scale(0.96); }
}

@keyframes blob-drift-c {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50%       { transform: translate(12px, 22px) scale(1.04); }
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(72px);
  pointer-events: none;
}

.blob-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent) 7%, transparent),
    transparent 68%
  );
  top: -120px;
  left: -140px;
  animation: blob-drift-a 26s ease-in-out infinite;
}

.blob-2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--accent-warm) 5%, transparent),
    transparent 65%
  );
  bottom: 80px;
  right: -80px;
  animation: blob-drift-b 32s ease-in-out infinite;
  animation-delay: -10s;
}

.blob-3 {
  width: 280px;
  height: 280px;
  background: radial-gradient(
    circle,
    color-mix(in srgb, var(--success) 4%, transparent),
    transparent 60%
  );
  top: 40%;
  left: 55%;
  animation: blob-drift-c 40s ease-in-out infinite;
  animation-delay: -18s;
}

@media (prefers-reduced-motion: reduce) {
  .blob { animation: none; }
}

/* ── Custom scrollbar ──────────────────────────────────────────────────────── */
.chat-scroll {
  scrollbar-width: thin;
  scrollbar-color: var(--surface-3) transparent;
}

.chat-scroll::-webkit-scrollbar {
  width: 4px;
}

.chat-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.chat-scroll::-webkit-scrollbar-thumb {
  background: var(--surface-3);
  border-radius: 99px;
  transition: background 0.2s;
}

.chat-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}

/* Fade the scrollbar when not scrolling — opacity on the container */
.chat-scroll {
  --sb-opacity: 0.4;
}

.chat-scroll:hover {
  --sb-opacity: 1;
}

.chat-scroll::-webkit-scrollbar-thumb {
  opacity: var(--sb-opacity);
}
</style>
