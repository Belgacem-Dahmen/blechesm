<template>
  <!-- ── Splash screen ──────────────────────────────────────────── -->
  <Transition name="splash">
    <div v-if="showSplash" class="splash-screen">
      <BlechEsmLoader size="88px" label="Chargement…" />
    </div>
  </Transition>

  <!-- ── App router ──────────────────────────────────────────────── -->
  <RouterView v-slot="{ Component }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="$route.path" />
    </Transition>
  </RouterView>

  <!-- ── Chatbot widget ─────────────────────────────────────────── -->
  <ChatBot />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import BlechEsmLoader from '@/components/ui/BlechEsmLoader.vue'
import ChatBot from '@/components/ui/ChatBot.vue'

const showSplash = ref(true)

onMounted(() => {
  setTimeout(() => { showSplash.value = false }, 1400)
})
</script>

<style>
.splash-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #080B14;
  display: flex;
  align-items: center;
  justify-content: center;
}

.splash-enter-active { transition: opacity 0.3s ease; }
.splash-leave-active { transition: opacity 0.55s ease; }
.splash-enter-from,
.splash-leave-to { opacity: 0; }
</style>
