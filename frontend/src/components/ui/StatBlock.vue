<template>
  <Motion
    :initial="{ opacity: 0, y: 20 }"
    :whileInView="{ opacity: 1, y: 0 }"
    :viewport="{ once: true }"
    :transition="{ duration: 0.5, ease: EASE, delay }"
    class="bg-surface-1 border border-border rounded-lg p-6"
  >
    <p class="text-text-3 text-xs font-medium uppercase tracking-widest mb-2">{{ label }}</p>
    <div class="flex items-end gap-2">
      <span class="font-display text-4xl font-semibold text-accent tracking-tight leading-none">{{ value }}</span>
      <span v-if="trend" :class="['text-sm font-medium mb-0.5', trendPositive ? 'text-success' : 'text-warning']">
        {{ trend }}
      </span>
    </div>
    <p v-if="sub" class="text-text-3 text-xs mt-2">{{ sub }}</p>
  </Motion>
</template>

<script setup>
import { computed } from 'vue'
import { Motion } from 'motion-v'
import { EASE } from '@/utils/motion.js'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  trend: { type: String, default: '' },
  sub:   { type: String, default: '' },
  delay: { type: Number, default: 0 },
})

const trendPositive = computed(() => props.trend.startsWith('+'))
</script>
