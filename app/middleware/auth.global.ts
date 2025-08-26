// middleware/auth.global.ts - Version corrigée
export default defineNuxtRouteMiddleware(async (to) => {
  // Ne pas exécuter le middleware côté serveur pour éviter les problèmes d'hydratation
  if (import.meta.server) return

  const authStore = useAuthStore()

  // Routes publiques - sortir immédiatement
  const publicRoutes = ['/login', '/signup']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // Si on a déjà un utilisateur dans le store, pas besoin de vérifier
  if (authStore.user) {
    return
  }

  try {
    const user = await authStore.checkAuth()
    if (user) {
      return
    } else {
      return navigateTo('/login')
    }
  } catch (err) {
    return navigateTo('/login')
  }
})
