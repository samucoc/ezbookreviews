import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  // Inicializar store correctamente
  const authStore = useAuthStore() // ✅ funciona solo en client o setup del middleware

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    if (process.client) {
      const wantsLogin = window.confirm(
        'Debes iniciar sesión para continuar. ¿Deseas ingresar tus credenciales?'
      )
      if (wantsLogin) return navigateTo('/login')
      else return navigateTo('/')
    } else {
      return navigateTo('/login')
    }
  }
})