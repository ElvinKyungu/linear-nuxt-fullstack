// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/login', '/signup']
  if (publicRoutes.includes(to.path)) return

  const authStore = useAuthStore()
  if (authStore.user) return

  try {
    // Forward cookie header when running on server (SSR)
    const ssrHeaders = import.meta.server ? useRequestHeaders(['cookie']) : undefined
    const user = await authStore.checkAuth(ssrHeaders)
    if (!user) return navigateTo('/login')
  } catch {
    return navigateTo('/login')
  }
})
