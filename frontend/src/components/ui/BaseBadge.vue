<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-medium',
      variantClasses,
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full shrink-0', dotClasses]" />
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'neutral' }, // success | warning | neutral | info
  label:  { type: String, default: '' },
})

const variantClasses = computed(() => ({
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  neutral: 'bg-surface-2 text-text-2',
  info:    'bg-accent/10 text-accent',
}[props.status] || 'bg-surface-2 text-text-2'))

const dotClasses = computed(() => ({
  success: 'bg-success',
  warning: 'bg-warning',
  neutral: 'bg-text-3',
  info:    'bg-accent',
}[props.status] || 'bg-text-3'))
</script>
