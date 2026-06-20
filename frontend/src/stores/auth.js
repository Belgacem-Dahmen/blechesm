import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(false)
  const currentUser = ref(null)
  const error = ref(null)

  function login(email, password) {
    error.value = null
    if (email === 'admin@demo.com' && password === 'demo') {
      isAuthenticated.value = true
      currentUser.value = { name: 'Admin Principal', email }
      return true
    }
    error.value = 'Email ou mot de passe incorrect.'
    return false
  }

  function logout() {
    isAuthenticated.value = false
    currentUser.value = null
    error.value = null
  }

  return { isAuthenticated, currentUser, error, login, logout }
})
