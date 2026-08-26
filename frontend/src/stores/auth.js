import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/lib/axios.js'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser     = ref(null)
  const error           = ref(null)
  const initialized     = ref(false)

  async function login(email, password) {
    error.value = null
    try {
      const user = await api.post('/api/auth/admin/login', { email, password })
      isAuthenticated.value = true
      currentUser.value     = user
      initialized.value     = true
      return true
    } catch (err) {
      error.value = err.message ?? 'Email ou mot de passe incorrect.'
      return false
    }
  }

  async function logout() {
    try { await api.post('/api/auth/admin/logout') } catch { /* ignorer */ }
    isAuthenticated.value = false
    currentUser.value     = null
    error.value           = null
    initialized.value     = false
  }

  // Vérifie le cookie httpOnly auprès du serveur.
  // No-op si déjà appelée dans cette session (évite un aller-retour inutile sur chaque navigation).
  async function checkAuth() {
    if (initialized.value) return
    initialized.value = true
    try {
      const user            = await api.get('/api/auth/admin/me')
      isAuthenticated.value = true
      currentUser.value     = user
    } catch {
      isAuthenticated.value = false
    }
  }

  return { isAuthenticated, currentUser, error, initialized, login, logout, checkAuth }
})
