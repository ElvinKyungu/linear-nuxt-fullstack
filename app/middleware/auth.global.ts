// middleware/auth.global.ts - Version simplifiée
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  console.log('➡️ Middleware triggered on', to.path)
  console.log('🔍 Current authStore.user:', authStore.user)

  // Routes publiques - sortir immédiatement
  if (['/login', '/signup'].includes(to.path)) {
    console.log('🔓 Route publique → accès direct')
    return
  }

  // Si on a déjà un utilisateur dans le store, pas besoin de vérifier
  if (authStore.user) {
    console.log('✅ User déjà en store, autorisation accordée')
    return
  }

  try {
    console.log('🔄 Vérification de l\'authentification...')
    const user = await authStore.checkAuth()
    
    if (user) {
      console.log('✅ User récupéré et mis en store:', user)
      return
    } else {
      console.log('❌ Pas d\'utilisateur authentifié → redirect login')
      return navigateTo('/login')
    }
  } catch (err) {
    console.log('❌ Erreur d\'authentification → redirect login', err)
    return navigateTo('/login')
  }
})