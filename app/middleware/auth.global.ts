export default defineNuxtRouteMiddleware(async (to) => {
  // Routes publiques
  if (['/login', '/signup'].includes(to.path)) return

  const authStore = useAuthStore()

  // Si déjà en mémoire → pas besoin de refetch
  if (authStore.user) return

  try {
    const { user } = await $fetch('/api/auth/me')
    authStore.user = user
  } catch {
    return navigateTo('/login')
  }
})
