<template>
  <span
    :class="[
      'inline-flex items-center gap-2 px-3.5 py-1.5 rounded-pill border border-strong bg-surface-1',
      'text-xs font-medium uppercase tracking-widest text-text-2',
      warm && 'border-accent-warm/30 text-accent-warm bg-surface-1',
    ]"
  >
    <span
      :class="['w-1.5 h-1.5 rounded-full', warm ? 'bg-accent-warm' : 'bg-accent']"
    />
    <slot />
  </span>
</template>

<script setup>
defineProps({
  warm: { type: Boolean, default: false },
})
</script>
