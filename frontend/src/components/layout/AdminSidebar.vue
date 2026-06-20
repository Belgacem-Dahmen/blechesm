<template>
  <!-- Overlay for mobile -->
  <Transition name="fade">
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/60 z-30 lg:hidden"
      @click="$emit('close')"
    />
  </Transition>

  <!-- Sidebar -->
  <aside
    :class="[
      'fixed top-0 left-0 h-full w-60 bg-surface-1 border-r border-border z-40 flex flex-col transition-transform duration-300',
      mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]"
  >
    <!-- Logo -->
    <div class="flex items-center gap-2 px-5 h-16 border-b border-border shrink-0">
      <img :src="logo" alt="Blechesm" class="h-7 w-auto" />
      <span class="ml-auto text-text-3 text-xs font-mono">Admin</span>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-4 px-3 overflow-y-auto">
      <div class="space-y-0.5">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative"
          :class="isActive(link.to)
            ? 'bg-surface-2 text-text'
            : 'text-text-2 hover:bg-surface-2 hover:text-text'"
          @click="$emit('close')"
        >
          <span
            v-if="isActive(link.to)"
            class="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-r-full"
          />
          <component :is="link.icon" class="w-4 h-4 shrink-0" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </div>
    </nav>

    <!-- Bottom -->
    <div class="px-3 pb-4 border-t border-border pt-3">
      <div class="px-3 py-2 mb-2">
        <p class="text-text-2 text-xs font-medium">{{ authStore.currentUser?.name }}</p>
        <p class="text-text-3 text-xs">{{ authStore.currentUser?.email }}</p>
      </div>
      <button
        @click="handleLogout"
        class="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-text-3 hover:bg-surface-2 hover:text-text transition-colors"
      >
        <LogOut class="w-4 h-4 shrink-0" />
        <span>Déconnexion</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { LayoutDashboard, ClipboardList, GalleryHorizontal, Users, LogOut } from 'lucide-vue-next'
import logo from '@/assets/logo.png'

defineProps({ mobileOpen: { type: Boolean, default: false } })
defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const navLinks = [
  { to: '/admin/dashboard', label: 'Dashboard',  icon: LayoutDashboard },
  { to: '/admin/demandes',  label: 'Demandes',   icon: ClipboardList },
  { to: '/admin/portfolio', label: 'Portfolio',  icon: GalleryHorizontal },
  { to: '/admin/comptes',   label: 'Comptes',    icon: Users },
]

function isActive(path) {
  return route.path === path || route.path.startsWith(path + '/')
}

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
