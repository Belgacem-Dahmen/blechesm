<template>
  <Motion
    :as="tag"
    v-bind="$attrs"
    :whileHover="hoverable ? { y: -4, transition: { duration: 0.2, ease: EASE } } : undefined"
    :class="[
      'bg-surface-1 border border-border rounded-lg',
      hoverable && 'cursor-pointer transition-shadow hover:border-border-strong hover:shadow-xl hover:shadow-black/40',
      padded && 'p-6',
    ]"
  >
    <slot />
  </Motion>
</template>

<script setup>
import { Motion } from 'motion-v'
import { EASE } from '@/utils/motion.js'

defineProps({
  hoverable: { type: Boolean, default: false },
  padded:    { type: Boolean, default: true },
  tag:       { type: String, default: 'div' },
})
</script>
