<template>
  <div class="min-h-screen bg-bg flex items-center justify-center px-4">
    <div class="absolute inset-0 grid-bg opacity-40 pointer-events-none" />

    <div class="relative w-full max-w-sm">
      <div class="text-center mb-8">
        <img :src="logo" alt="Blechesm" class="h-10 w-auto mx-auto mb-3" />
        <p class="text-text-3 text-xs uppercase tracking-widest">Espace admin</p>
      </div>

      <div class="bg-surface-1 border border-border rounded-xl p-8 shadow-2xl shadow-black/60">
        <h1 class="font-display text-xl font-semibold text-text mb-1">Connexion</h1>
        <p class="text-text-3 text-xs mb-6">admin@demo.com / demo</p>

        <form @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <BaseInput v-model="email"    type="email"    label="Email"          placeholder="admin@demo.com" required :error="errors.email"    autocomplete="email" />
          <BaseInput v-model="password" type="password" label="Mot de passe"   placeholder="••••••••"       required :error="errors.password" autocomplete="current-password" />

          <Transition name="fade">
            <div v-if="authStore.error" class="flex items-center gap-2 bg-warning-soft text-warning text-sm px-3 py-2.5 rounded-sm">
              <AlertTriangle class="w-4 h-4 shrink-0" />
              <span>{{ authStore.error }}</span>
            </div>
          </Transition>

          <BaseButton type="submit" size="lg" :loading="loading" class="w-full mt-2">Se connecter</BaseButton>
        </form>
      </div>

      <RouterLink to="/" class="flex items-center justify-center gap-1.5 text-text-3 text-xs mt-6 hover:text-text-2 transition-colors">
        <ArrowLeft class="w-3.5 h-3.5" />
        Retour au site
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { AlertTriangle, ArrowLeft } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth.js'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import logo from '@/assets/logo.png'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const email = ref('')
const password = ref('')
const errors = reactive({ email: '', password: '' })

async function handleLogin() {
  errors.email = ''
  errors.password = ''
  authStore.error = null

  if (!email.value)    { errors.email    = 'Requis'; return }
  if (!password.value) { errors.password = 'Requis'; return }

  loading.value = true
  await new Promise(r => setTimeout(r, 400))
  const ok = authStore.login(email.value, password.value)
  loading.value = false

  if (ok) router.push('/admin/dashboard')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
