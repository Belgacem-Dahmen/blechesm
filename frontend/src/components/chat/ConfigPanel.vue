<template>
  <div class="p-5 space-y-5">
    <!-- Header -->
    <Motion
      :initial="{ opacity: 0, y: -8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: EASE, delay: 0.35 }"
    >
      <p class="text-[10px] font-mono uppercase tracking-widest text-text-3 mb-1">Configuration</p>
      <Motion
        v-if="data.service"
        :initial="{ opacity: 0, x: -10 }"
        :animate="{ opacity: 1, x: 0 }"
        :transition="{ duration: 0.38, ease: EASE, delay: 0.5 }"
        class="flex items-center gap-2 mt-2"
      >
        <div class="w-2 h-2 rounded-full shrink-0 dot-pulse" :style="{ background: data.service.color }" />
        <span class="text-sm font-medium text-text">{{ data.service.label }}</span>
        <Motion
          :initial="{ opacity: 0, scale: 0.75 }"
          :animate="{ opacity: 1, scale: 1 }"
          :transition="{ duration: 0.3, ease: EASE, delay: 0.65 }"
          class="ml-auto text-[9px] font-mono font-bold uppercase tracking-widest px-1.5 py-[2px] rounded border"
          :style="{
            color: data.service.color,
            borderColor: `color-mix(in srgb, ${data.service.color} 30%, transparent)`,
            background: `color-mix(in srgb, ${data.service.color} 8%, transparent)`,
          }"
        >{{ data.service.badge }}</Motion>
      </Motion>
      <p v-else class="text-xs text-text-3 mt-1">En attente de sélection…</p>
    </Motion>

    <!-- Divider -->
    <div class="h-px bg-border" />

    <!-- Photos -->
    <Motion
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="{ duration: 0.4, ease: EASE, delay: 0.45 }"
      class="space-y-2"
    >
      <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Photos</p>
      <div class="space-y-2">
        <!-- Wall photo -->
        <div class="flex items-center gap-2">
          <div
            class="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
            :class="data.hasWall ? 'bg-success/20 border border-success/40' : 'bg-surface-3 border border-border'"
          >
            <Check v-if="data.hasWall" class="w-2 h-2 text-success" />
          </div>
          <span class="text-xs transition-colors duration-300" :class="data.hasWall ? 'text-text-2' : 'text-text-3'">Photo principale</span>
        </div>
        <Motion
          v-if="data.hasWall && data.wallUrl"
          :initial="{ opacity: 0, scale: 0.92, y: 6 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.4, ease: EASE }"
          class="rounded-lg overflow-hidden border border-border ml-5"
        >
          <img :src="data.wallUrl" alt="Photo principale" class="w-full h-20 object-cover" />
        </Motion>

        <!-- Ref photo -->
        <div class="flex items-center gap-2">
          <div
            class="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
            :class="data.hasRef ? 'bg-success/20 border border-success/40' : 'bg-surface-3 border border-border'"
          >
            <Check v-if="data.hasRef" class="w-2 h-2 text-success" />
          </div>
          <span class="text-xs transition-colors duration-300" :class="data.hasRef ? 'text-text-2' : 'text-text-3'">Référence (optionnel)</span>
        </div>
        <Motion
          v-if="data.hasRef && data.refUrl"
          :initial="{ opacity: 0, scale: 0.92, y: 6 }"
          :animate="{ opacity: 1, scale: 1, y: 0 }"
          :transition="{ duration: 0.4, ease: EASE }"
          class="rounded-lg overflow-hidden border border-border ml-5"
        >
          <img :src="data.refUrl" alt="Référence" class="w-full h-16 object-cover" />
        </Motion>
      </div>
    </Motion>

    <!-- Answers -->
    <template v-if="data.answers.length > 0">
      <div class="h-px bg-border mt-2" />
      <Motion
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.4, ease: EASE }"
        class="space-y-2"
      >
        <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Réponses</p>
        <div class="space-y-1.5">
          <Motion
            v-for="(answer, i) in data.answers"
            :key="i"
            :initial="{ opacity: 0, x: -8 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.3, ease: EASE, delay: i * 0.06 }"
            class="flex items-start gap-2"
          >
            <span class="text-[10px] font-mono text-text-3 mt-[2px] shrink-0 w-16 truncate">
              {{ data.questions[i]?.label ?? `Q${i + 1}` }}
            </span>
            <span class="text-xs text-text-2 leading-tight">{{ answer }}</span>
          </Motion>
        </div>
      </Motion>
    </template>

    <!-- Dimensions -->
    <template v-if="data.dimensions.width && data.dimensions.height">
      <div class="h-px bg-border" />
      <Motion
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.38, ease: EASE }"
        class="space-y-1.5"
      >
        <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Dimensions</p>
        <div class="flex items-center gap-1.5">
          <span class="text-sm font-mono text-text">{{ data.dimensions.width }}</span>
          <span class="text-text-3 text-xs">m × </span>
          <span class="text-sm font-mono text-text">{{ data.dimensions.height }}</span>
          <span class="text-text-3 text-xs">m</span>
        </div>
      </Motion>
    </template>

    <!-- Contact -->
    <template v-if="data.contact.name || data.contact.email">
      <div class="h-px bg-border" />
      <Motion
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.38, ease: EASE }"
        class="space-y-1.5"
      >
        <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Contact</p>
        <p v-if="data.contact.name" class="text-xs text-text-2">{{ data.contact.name }}</p>
        <p v-if="data.contact.email" class="text-xs text-text-3">{{ data.contact.email }}</p>
        <p v-if="data.contact.budget" class="text-xs text-text-3">{{ data.contact.budget }}</p>
      </Motion>
    </template>

    <!-- Versions -->
    <template v-if="data.versions.length > 0">
      <div class="h-px bg-border" />
      <Motion
        :initial="{ opacity: 0, y: 8 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.38, ease: EASE }"
        class="space-y-2"
      >
        <p class="text-[10px] font-mono uppercase tracking-widest text-text-3">Générations</p>
        <div class="grid grid-cols-2 gap-2">
          <Motion
            v-for="(v, i) in data.versions"
            :key="i"
            :initial="{ opacity: 0, scale: 0.88 }"
            :animate="{ opacity: 1, scale: 1 }"
            :transition="{ duration: 0.35, ease: EASE, delay: i * 0.07 }"
            class="rounded-lg overflow-hidden border border-border-strong"
          >
            <img :src="v.url" :alt="v.label" class="w-full h-16 object-cover" />
            <p class="text-[9px] font-mono text-text-3 text-center py-1 bg-surface-3">{{ v.label }}</p>
          </Motion>
        </div>
      </Motion>
    </template>

    <!-- Status -->
    <div class="h-px bg-border" />
    <div class="flex items-center gap-2">
      <div class="w-1.5 h-1.5 rounded-full shrink-0 transition-all duration-500" :class="statusDot" />
      <span class="text-xs text-text-3 transition-all duration-300">{{ statusLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { Check } from 'lucide-vue-next'
import { EASE } from '@/utils/motion.js'

const props = defineProps({
  data:         { type: Object, required: true },
  phase:        { type: String, default: 'welcome' },
  serviceColor: { type: String, default: '#3D7BFF' },
})

const STATUS = {
  welcome:    { dot: 'bg-text-3',   label: 'En attente…' },
  service:    { dot: 'bg-text-3',   label: 'En attente…' },
  photo:      { dot: 'bg-warning',  label: 'Photo requise' },
  ref_photo:  { dot: 'bg-warning',  label: 'Référence (optionnel)' },
  questions:  { dot: 'bg-accent',   label: 'Questions en cours' },
  dimensions: { dot: 'bg-accent',   label: 'Dimensions requises' },
  contact:    { dot: 'bg-accent',   label: 'Contact requis' },
  confirm:    { dot: 'bg-success',  label: 'Prêt à générer' },
  generating: { dot: 'bg-warning animate-pulse', label: 'Génération en cours…' },
  result:     { dot: 'bg-success',  label: 'Image générée' },
  modify:     { dot: 'bg-accent',   label: 'Modification en cours' },
}

const statusDot   = computed(() => STATUS[props.phase]?.dot   ?? 'bg-text-3')
const statusLabel = computed(() => STATUS[props.phase]?.label ?? 'En cours…')
</script>

<style scoped>
/* Service dot pulse on first appear */
@keyframes dot-appear {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.4); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.dot-pulse {
  animation: dot-appear 0.5s var(--ease-spring, cubic-bezier(0.22, 1, 0.36, 1)) forwards;
  animation-delay: 0.6s;
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .dot-pulse { animation: none; opacity: 1; }
}
</style>
