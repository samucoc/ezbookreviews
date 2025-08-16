// ~/stores/auth.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const email = ref<string | null>(null)
  const isLoggedIn = ref(false)

  // Inicializar desde localStorage solo en cliente
  if (process.client) {
    const savedToken = localStorage.getItem('token')
    const savedEmail = localStorage.getItem('email')
    if (savedToken) {
      token.value = savedToken
      email.value = savedEmail
      isLoggedIn.value = true
    }
  }

  function login(userToken: string, userEmail: string) {
    token.value = userToken
    email.value = userEmail
    isLoggedIn.value = true
    if (process.client) {
      localStorage.setItem('token', userToken)
      localStorage.setItem('email', userEmail)
    }
  }

  function logout() {
    token.value = null
    email.value = null
    isLoggedIn.value = false
    if (process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('email')
    }
  }

  return { token, email, isLoggedIn, login, logout }
})
