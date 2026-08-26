<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div v-if="state.visible" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="cancel" />
        <div class="relative bg-surface-1 border border-border rounded-xl w-full max-w-sm p-6 shadow-2xl">
          <h3 class="font-display font-semibold text-text mb-2">{{ state.title }}</h3>
          <p class="text-text-2 text-sm mb-6">{{ state.message }}</p>
          <div class="flex gap-3 justify-end">
            <BaseButton variant="ghost" size="sm" @click="cancel">Annuler</BaseButton>
            <BaseButton variant="danger" size="sm" @click="confirm">{{ state.confirmLabel }}</BaseButton>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { useConfirm } from '@/composables/useConfirm.js'
import BaseButton from '@/components/ui/BaseButton.vue'

const { state, confirm, cancel } = useConfirm()
</script>

<style scoped>
.confirm-enter-active, .confirm-leave-active { transition: opacity 0.15s ease; }
.confirm-enter-from, .confirm-leave-to { opacity: 0; }
</style>
