<template>
  <div v-if="isPublic" class="chatbot-wrapper">

    <!-- ── Panel ─────────────────────────────────────────────────── -->
    <Transition name="chatbot-panel">
      <div v-if="isOpen" class="chatbot-panel">

        <!-- Header -->
        <div class="chatbot-header">
          <div class="flex items-center gap-3">
            <div class="chatbot-avatar">
              <Sparkles class="w-4 h-4" />
            </div>
            <div>
              <p class="chatbot-header-title">Blechesm AI</p>
              <div class="flex items-center gap-1.5 mt-0.5">
                <span class="cb-online-dot" />
                <p class="chatbot-header-sub">Assistant · En ligne</p>
              </div>
            </div>
          </div>
          <button @click="close" class="chatbot-close" aria-label="Fermer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Messages -->
        <div ref="messagesEl" class="chatbot-messages">
          <TransitionGroup name="cb-msg">
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="msg.role === 'bot' ? 'cb-row cb-row--bot' : 'cb-row cb-row--user'"
            >
              <div v-if="msg.role === 'bot'" class="chatbot-avatar chatbot-avatar--sm shrink-0">
                <Sparkles class="w-3 h-3" />
              </div>
              <div :class="msg.role === 'bot' ? 'cb-bubble cb-bubble--bot' : 'cb-bubble cb-bubble--user'">
                {{ msg.text }}
              </div>
            </div>
          </TransitionGroup>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="cb-row cb-row--bot">
            <div class="chatbot-avatar chatbot-avatar--sm shrink-0">
              <Sparkles class="w-3 h-3" />
            </div>
            <div class="cb-bubble cb-bubble--bot cb-typing">
              <span /><span /><span />
            </div>
          </div>
        </div>

        <!-- Suggestion chips -->
        <div v-if="currentOptions.length && !isDone && !isTyping" class="chatbot-chips">
          <button
            v-for="opt in currentOptions"
            :key="opt.label"
            class="chatbot-chip"
            @click="answer(opt)"
          >{{ opt.label }}</button>
        </div>

        <!-- Final CTA -->
        <div v-if="isDone" class="chatbot-footer">
          <button class="chatbot-cta-btn" @click="goToCta">
            <Sparkles class="w-4 h-4" />
            {{ ctaLabel }}
          </button>
          <p class="chatbot-footer-note">Gratuit · Sans engagement</p>
        </div>

      </div>
    </Transition>

    <!-- ── FAB ───────────────────────────────────────────────────── -->
    <button
      class="chatbot-fab"
      :class="{ 'chatbot-fab--open': isOpen }"
      @click="toggle"
      aria-label="Ouvrir l'assistant Blechesm"
    >
      <Transition name="icon-swap" mode="out-in">
        <X v-if="isOpen" key="x" class="w-5 h-5" />
        <MessageCircle v-else key="mc" class="w-5 h-5" />
      </Transition>
      <span v-if="!isOpen && showDot" class="chatbot-dot" />
    </button>

  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Sparkles, X, MessageCircle } from 'lucide-vue-next'
import { useRequestStore } from '@/stores/request.js'

const route  = useRoute()
const router = useRouter()
const store  = useRequestStore()

// Only show on public (non-admin) pages
const isPublic = computed(() => !route.path.startsWith('/admin'))

// ── State ────────────────────────────────────────────────────────
const isOpen   = ref(false)
const isTyping = ref(false)
const isDone   = ref(false)
const showDot  = ref(false)
const messages = ref([])
const step     = ref(0)
const messagesEl      = ref(null)
const ctaLabel        = ref('Lancer la visualisation IA →')
const ctaPath         = ref('/configurateur')
const selectedService = ref('mural')

// ── Conversation flow ────────────────────────────────────────────
const flow = [
  {
    text: "Bonjour ! 👋 Qu'est-ce que vous souhaitez créer ?",
    options: [
      { label: '🎨 Fresque murale',        value: 'mural'    },
      { label: '🗿 Sculpture 3D',          value: 'sculpture'},
      { label: '🪨 Art au sol',            value: 'sol'      },
      { label: '🤔 Je ne sais pas encore', value: 'unknown'  },
    ],
  },
  {
    text: 'Avez-vous déjà un espace en tête ?',
    options: [
      { label: '✅ Oui, un endroit précis', value: 'yes'     },
      { label: '🏢 Espace professionnel',   value: 'pro'     },
      { label: '🔍 Je cherche encore',      value: 'explore' },
    ],
  },
  {
    text: 'Notre IA génère un aperçu réaliste de votre projet en 2 secondes — gratuitement.',
    options: [
      { label: '🚀 Voir mon projet en IA !', value: 'go'      },
      { label: '📞 Parler à un artiste',     value: 'contact' },
    ],
  },
]

const currentOptions = computed(() =>
  isDone.value || step.value >= flow.length ? [] : flow[step.value]?.options ?? []
)

// ── Helpers ──────────────────────────────────────────────────────
function delay(ms) { return new Promise(r => setTimeout(r, ms)) }

function scrollDown() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

async function pushBot(text) {
  isTyping.value = true
  scrollDown()
  await delay(680)
  isTyping.value = false
  messages.value.push({ role: 'bot', text })
  scrollDown()
}

// ── Answer handler ───────────────────────────────────────────────
async function answer(opt) {
  messages.value.push({ role: 'user', text: opt.label })
  scrollDown()

  // Capture service type from first question
  if (step.value === 0 && ['mural', 'sculpture', 'sol'].includes(opt.value)) {
    selectedService.value = opt.value
  }

  const nextStep = step.value + 1
  step.value = nextStep

  if (nextStep >= flow.length) {
    if (opt.value === 'contact') {
      await pushBot("Je vous mets en contact avec notre équipe ! 📞")
      ctaPath.value  = '/contact'
      ctaLabel.value = 'Contacter notre équipe'
    } else {
      await pushBot("Parfait ! Votre aperçu IA est à 2 secondes. C'est parti 🎨")
      ctaPath.value  = '/configurateur'
      ctaLabel.value = 'Lancer la visualisation IA →'
    }
    isDone.value = true
  } else {
    await pushBot(flow[nextStep].text)
  }
}

// ── Open / close / toggle ────────────────────────────────────────
function open() {
  isOpen.value  = true
  showDot.value = false
  sessionStorage.setItem('bl-chat-opened', '1')
  if (messages.value.length === 0) pushBot(flow[0].text)
}

function close() { isOpen.value = false }

function toggle() { isOpen.value ? close() : open() }

// ── CTA navigation ───────────────────────────────────────────────
function goToCta() {
  if (ctaPath.value === '/configurateur') {
    store.serviceType = selectedService.value
  }
  close()
  router.push(ctaPath.value)
}

// ── Auto-open on first visit ─────────────────────────────────────
onMounted(() => {
  if (!sessionStorage.getItem('bl-chat-opened')) {
    showDot.value = true
    setTimeout(open, 2800)
  }
})
</script>

<style scoped>
/* ── Wrapper ─────────────────────────────────────────────────────── */
.chatbot-wrapper {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

/* ── Panel ───────────────────────────────────────────────────────── */
.chatbot-panel {
  width: 340px;
  max-height: 520px;
  display: flex;
  flex-direction: column;
  background: #0C0F1D;
  border: 1px solid rgba(255,255,255,0.1);
  border-top: 2px solid #3D7BFF;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 24px 60px rgba(0,0,0,0.65),
    0 0 0 1px rgba(61,123,255,0.08),
    0 0 40px rgba(61,123,255,0.07);
}

/* ── Header ──────────────────────────────────────────────────────── */
.chatbot-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  background: rgba(255,255,255,0.03);
}

.chatbot-header-title {
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
}

.chatbot-header-sub {
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.chatbot-close {
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.15s, background 0.15s;
}
.chatbot-close:hover {
  color: #fff;
  background: rgba(255,255,255,0.1);
}

/* ── Online dot ──────────────────────────────────────────────────── */
.cb-online-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4ADE80;
  box-shadow: 0 0 6px rgba(74,222,128,0.65);
  animation: cb-live 2s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes cb-live {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}

/* ── Avatar ──────────────────────────────────────────────────────── */
.chatbot-avatar {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: rgba(61,123,255,0.14);
  border: 1px solid rgba(61,123,255,0.28);
  color: #3D7BFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.chatbot-avatar--sm {
  width: 24px;
  height: 24px;
  border-radius: 6px;
}

/* ── Messages ────────────────────────────────────────────────────── */
.chatbot-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  overflow-y: auto;
  scroll-behavior: smooth;
  min-height: 100px;
}
.chatbot-messages::-webkit-scrollbar { width: 3px; }
.chatbot-messages::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.1);
  border-radius: 4px;
}

.cb-row {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.cb-row--user { flex-direction: row-reverse; }

.cb-bubble {
  max-width: 82%;
  padding: 9px 13px;
  border-radius: 12px;
  font-size: 13px;
  line-height: 1.55;
}
.cb-bubble--bot {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.88);
  border-bottom-left-radius: 3px;
}
.cb-bubble--user {
  background: #3D7BFF;
  color: #fff;
  border-bottom-right-radius: 3px;
}

/* Typing indicator */
.cb-typing {
  display: flex !important;
  align-items: center;
  gap: 5px;
  padding: 12px 14px !important;
}
.cb-typing span {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  animation: cb-dot 1.2s ease-in-out infinite;
}
.cb-typing span:nth-child(2) { animation-delay: 0.2s; }
.cb-typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes cb-dot {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
  30%            { transform: translateY(-5px); opacity: 1; }
}

/* ── Chips ───────────────────────────────────────────────────────── */
.chatbot-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 2px 16px 14px;
  flex-shrink: 0;
}
.chatbot-chip {
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.18);
  background: rgba(255,255,255,0.07);
  color: rgba(255,255,255,0.78);
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, color 0.15s, background 0.15s;
}
.chatbot-chip:hover {
  border-color: #3D7BFF;
  color: #3D7BFF;
  background: rgba(61,123,255,0.1);
}

/* ── Footer / CTA ────────────────────────────────────────────────── */
.chatbot-footer {
  flex-shrink: 0;
  padding: 14px 16px;
  border-top: 1px solid rgba(255,255,255,0.07);
  background: rgba(0,0,0,0.25);
}
.chatbot-cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 11px 16px;
  border-radius: 8px;
  background: #3D7BFF;
  color: #fff;
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  border: 2px solid rgba(0,0,0,0.2);
  box-shadow: 3px 3px 0 rgba(0,0,0,0.45);
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.15s ease;
}
.chatbot-cta-btn:hover {
  background: #2d68f0;
  transform: translate(1.5px, 1.5px);
  box-shadow: 1.5px 1.5px 0 rgba(0,0,0,0.45);
}
.chatbot-cta-btn:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0;
}
.chatbot-footer-note {
  text-align: center;
  font-family: var(--font-mono);
  font-size: 10px;
  color: rgba(255,255,255,0.28);
  margin-top: 8px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ── FAB ─────────────────────────────────────────────────────────── */
.chatbot-fab {
  position: relative;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #3D7BFF;
  color: #fff;
  border: 2px solid rgba(0,0,0,0.2);
  box-shadow: 4px 4px 0 rgba(0,0,0,0.45), 0 0 24px rgba(61,123,255,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}
.chatbot-fab:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 rgba(0,0,0,0.45), 0 0 32px rgba(61,123,255,0.45);
}
.chatbot-fab--open {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.2);
  box-shadow: none;
}
.chatbot-fab--open:hover {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0 rgba(0,0,0,0.3);
}

/* Notification dot */
.chatbot-dot {
  position: absolute;
  top: 1px;
  right: 1px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: #FF6B35;
  border: 2px solid #080B14;
  box-shadow: 0 0 8px rgba(255,107,53,0.65);
  animation: cb-dot-bounce 1.6s ease-in-out infinite;
}
@keyframes cb-dot-bounce {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.25); }
}

/* ── Transitions ─────────────────────────────────────────────────── */
.chatbot-panel-enter-active {
  transition: opacity 0.25s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}
.chatbot-panel-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.chatbot-panel-enter-from,
.chatbot-panel-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.97);
}

.cb-msg-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.cb-msg-enter-from   { opacity: 0; transform: translateY(8px); }

.icon-swap-enter-active,
.icon-swap-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.icon-swap-enter-from   { opacity: 0; transform: scale(0.6) rotate(90deg); }
.icon-swap-leave-to     { opacity: 0; transform: scale(0.6) rotate(-90deg); }

/* ── Reduced motion ──────────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .chatbot-panel-enter-active,
  .chatbot-panel-leave-active,
  .cb-msg-enter-active,
  .icon-swap-enter-active,
  .icon-swap-leave-active { transition: none; }
  .chatbot-fab, .chatbot-close,
  .chatbot-chip, .chatbot-cta-btn { transition: none; }
  .cb-online-dot, .chatbot-dot, .cb-typing span { animation: none; }
}
</style>
