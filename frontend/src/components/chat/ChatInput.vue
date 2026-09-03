<template>
  <div class="border-t border-border bg-bg/95 backdrop-blur-md px-4 py-3 shrink-0">
    <div class="max-w-2xl mx-auto space-y-1.5">
      <!-- Input bar -->
      <div
        class="input-bar flex items-end gap-2 bg-surface-2 border rounded-2xl px-3 py-2 transition-all duration-200"
        :class="isDisabled ? 'border-border opacity-55 cursor-not-allowed' : 'border-border-strong'"
      >
        <!-- Attach button -->
        <label
          class="flex-shrink-0 p-1.5 rounded-lg transition-all duration-150 group/attach"
          :class="isDisabled
            ? 'text-text-3 cursor-not-allowed pointer-events-none'
            : 'text-text-3 hover:text-accent hover:bg-accent/10 cursor-pointer'"
          :title="isDisabled ? '' : 'Importer une image'"
        >
          <Paperclip class="w-4 h-4 transition-transform duration-150 group-hover/attach:scale-110" />
          <input
            type="file"
            accept="image/*"
            class="sr-only"
            :disabled="isDisabled"
            @change="onFileAttach"
          />
        </label>

        <!-- Attached file preview chip — slides in -->
        <Motion
          v-if="attachedFile"
          :initial="{ opacity: 0, x: -10, scale: 0.88 }"
          :animate="{ opacity: 1, x: 0, scale: 1 }"
          :transition="{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }"
          class="flex items-center gap-1.5 px-2 py-1 bg-surface-3 border border-border rounded-lg text-xs text-text-2 shrink-0"
        >
          <ImageIcon class="w-3 h-3 text-text-3 shrink-0" />
          <span class="max-w-[80px] truncate">{{ attachedFile.name }}</span>
          <button
            class="text-text-3 hover:text-warning transition-colors ml-0.5"
            @click.stop="attachedFile = null"
          >
            <X class="w-3 h-3" />
          </button>
        </Motion>

        <!-- Text input -->
        <input
          v-model="inputText"
          type="text"
          :placeholder="placeholder"
          :disabled="isDisabled"
          class="flex-1 bg-transparent text-text text-sm placeholder:text-text-3 focus:outline-none min-w-0 py-1 disabled:cursor-not-allowed transition-colors"
          @keydown.enter.prevent="handleSend"
        />

        <!-- Send button with Motion -->
        <Motion
          as="button"
          :whileHover="canSend ? { scale: 1.12, transition: { duration: 0.15 } } : undefined"
          :whileTap="canSend ? { scale: 0.88, transition: { duration: 0.08 } } : undefined"
          class="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200"
          :class="canSend
            ? 'bg-accent text-white shadow-[0_2px_12px_rgba(61,123,255,0.4)] send-ready'
            : 'bg-surface-3 text-text-3 cursor-not-allowed'"
          :disabled="!canSend"
          :title="canSend ? 'Envoyer' : ''"
          @click="handleSend"
        >
          <ArrowUp class="w-4 h-4" />
        </Motion>
      </div>

      <!-- Footer hint -->
      <p class="text-center text-[10px] text-text-3 select-none">
        BlechESM IA · Les réponses sont générées par IA
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Motion } from 'motion-v'
import { Paperclip, ArrowUp, X, Image as ImageIcon } from 'lucide-vue-next'

const props = defineProps({
  phase:    { type: String, default: 'welcome' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['send', 'send-file'])

const inputText    = ref('')
const attachedFile = ref(null)

// Phases where free text input is not the primary interaction
const TEXT_DISABLED_PHASES = new Set([
  'welcome', 'service', 'photo', 'ref_photo',
  'dimensions', 'contact', 'confirm', 'generating', 'result',
])

const isDisabled = computed(() => props.disabled || TEXT_DISABLED_PHASES.has(props.phase))

const PLACEHOLDERS = {
  welcome:    'Choisissez un service ci-dessus…',
  service:    'Choisissez un service ci-dessus…',
  photo:      'Importez votre photo ci-dessus…',
  ref_photo:  'Importez une référence ou passez…',
  questions:  'Ou écrivez votre réponse…',
  dimensions: 'Renseignez les dimensions ci-dessus…',
  contact:    'Complétez le formulaire ci-dessus…',
  confirm:    'Cliquez sur Générer pour lancer…',
  generating: 'Génération en cours, veuillez patienter…',
  result:     'Utilisez les boutons ci-dessus…',
  modify:     'Décrivez votre modification…',
}

const placeholder = computed(() => PLACEHOLDERS[props.phase] ?? 'Votre message…')

const canSend = computed(() => {
  if (props.disabled) return false
  if (attachedFile.value) return true
  return !isDisabled.value && !!inputText.value.trim()
})

function handleSend() {
  if (!canSend.value) return
  if (attachedFile.value) {
    emit('send-file', attachedFile.value)
    attachedFile.value = null
    return
  }
  emit('send', inputText.value.trim())
  inputText.value = ''
}

function onFileAttach(e) {
  const file = e.target.files?.[0]
  if (file) attachedFile.value = file
  e.target.value = ''
}
</script>

<style scoped>
/* Focus glow — complex multi-state with :focus-within child selector */
.input-bar:focus-within {
  border-color: rgba(61, 123, 255, 0.45);
  box-shadow:
    0 0 0 3px rgba(61, 123, 255, 0.07),
    0 4px 24px rgba(0, 0, 0, 0.2);
}

/* Send button ready-state ambient glow pulse */
@keyframes send-glow {
  0%, 100% { box-shadow: 0 2px 12px rgba(61, 123, 255, 0.4); }
  50%       { box-shadow: 0 2px 20px rgba(61, 123, 255, 0.65); }
}
.send-ready {
  animation: send-glow 2.2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .send-ready { animation: none; }
}
</style>
