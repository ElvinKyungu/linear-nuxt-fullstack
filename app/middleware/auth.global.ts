export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return   // ⬅️ Prevents redirect loop on SSR

  const authStore = useAuthStore()
  const publicRoutes = ['/login', '/signup']
  if (publicRoutes.includes(to.path)) return

  if (!authStore.user) {
    try {
      const user = await authStore.checkAuth()
      if (!user) return navigateTo('/login')
    } catch {
      return navigateTo('/login')
    }
  }
})
