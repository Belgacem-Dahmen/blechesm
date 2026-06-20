<template>
  <div
    :class="['flex flex-col items-center justify-center gap-4', fullScreen && 'min-h-[400px]']"
    role="status"
    :aria-label="label"
  >
    <!-- Animated bars — CSS only, respects prefers-reduced-motion -->
    <div class="flex items-end gap-1 h-10" aria-hidden="true">
      <span
        v-for="i in 5"
        :key="i"
        class="w-1.5 rounded-full bg-accent loading-bar"
        :style="{ animationDelay: `${(i - 1) * 0.1}s` }"
      />
    </div>
    <p class="text-text-2 text-sm">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  label:      { type: String, default: 'Chargement…' },
  fullScreen: { type: Boolean, default: false },
})
</script>

<style scoped>
.loading-bar {
  animation: loading-bounce 0.8s ease-in-out infinite alternate;
  height: 12px;
}

@keyframes loading-bounce {
  from { height: 8px; opacity: 0.4; }
  to   { height: 36px; opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .loading-bar {
    animation: none;
    height: 24px;
    opacity: 0.6;
  }
}
</style>
