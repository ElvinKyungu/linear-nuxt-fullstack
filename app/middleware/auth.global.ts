// middleware/auth.global.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  console.log('➡️ Middleware triggered on', to.path)
  console.log('🔍 Current authStore.user:', authStore.user)
  console.log('🔍 Cookie auth-token:', useCookie('auth-token').value)

  // Routes publiques - sortir immédiatement
  if (['/login', '/signup'].includes(to.path)) {
    console.log('🔓 Route publique → accès direct')
    return
  }

  // Si on a déjà un utilisateur dans le store, pas besoin de vérifier l'API
  if (authStore.user) {
    console.log('✅ User déjà en store, autorisation accordée')
    return
  }

  // Vérifier si on a un token
  const token = useCookie('auth-token').value
  if (!token) {
    console.log('❌ Pas de token → redirect login')
    return navigateTo('/login')
  }

  try {
    console.log('🔄 Tentative de récupération user depuis API...')
    const { user } = await $fetch('/api/auth/me', {
      credentials: 'include'
    })
    
    if (user) {
      authStore.user = user
      console.log('✅ User récupéré depuis API et mis en store:', user)
      return
    } else {
      console.log('❌ API a retourné null → redirect login')
      return navigateTo('/login')
    }
  } catch (err) {
    console.log('❌ Erreur API → redirect login', err)
    
    // Supprimer le token invalide
    const authTokenCookie = useCookie('auth-token')
    authTokenCookie.value = null
    
    return navigateTo('/login')
  }
})