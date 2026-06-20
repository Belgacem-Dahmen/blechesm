<template>
  <div class="min-h-screen bg-bg flex">
    <AdminSidebar :mobileOpen="sidebarOpen" @close="sidebarOpen = false" />

    <div class="flex-1 lg:pl-60 min-w-0">
      <!-- Topbar -->
      <header class="sticky top-0 z-20 h-16 bg-bg/90 backdrop-blur-sm border-b border-border flex items-center px-4 sm:px-6 gap-4">
        <button
          @click="sidebarOpen = true"
          class="lg:hidden p-2 rounded-sm hover:bg-surface-2 text-text-2 hover:text-text transition-colors"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon class="w-5 h-5" />
        </button>

        <h1 class="text-text font-display font-semibold text-base tracking-tight flex-1">{{ pageTitle }}</h1>

        <div class="w-7 h-7 rounded-sm bg-accent flex items-center justify-center text-white text-xs font-medium">
          {{ initials }}
        </div>
      </header>

      <main class="p-4 sm:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { Menu as MenuIcon } from 'lucide-vue-next'
import AdminSidebar from './AdminSidebar.vue'

const sidebarOpen = ref(false)
const route = useRoute()
const authStore = useAuthStore()

const pageTitles = {
  '/admin/dashboard': 'Dashboard',
  '/admin/demandes':  'Demandes de devis',
  '/admin/portfolio': 'Portfolio',
  '/admin/comptes':   'Comptes admin',
}

const pageTitle = computed(() =>
  route.name === 'admin-request-detail' ? 'Détail demande' : (pageTitles[route.path] || 'Admin')
)

const initials = computed(() => {
  const name = authStore.currentUser?.name || 'A'
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
})
</script>
