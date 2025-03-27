import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/register']

  // Si la ruta es pública, permitir acceso
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Si no está autenticado, redirigir a login
  if (!authStore.isAuthenticated) {
    try {
      await authStore.fetchProfile()
    } catch (error) {
      return navigateTo('/login')
    }
  }
}) 