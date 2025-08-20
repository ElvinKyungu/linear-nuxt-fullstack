export default defineNuxtRouteMiddleware(async (to) => {
  // Routes publiques
  if (['/login', '/signup'].includes(to.path)) return
  
  // Côté serveur, on fait confiance au token
  if (import.meta.server) return
  
  // Côté client, vérifier si l'utilisateur est connecté
  const { $fetch } = useNuxtApp()
  
  try {
    await $fetch('/api/auth/me')
  } catch {
    return navigateTo('/login')
  }
})