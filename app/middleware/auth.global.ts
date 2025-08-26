export default defineNuxtRouteMiddleware(async (to) => {
  if (['/login', '/signup'].includes(to.path)) return

  const authStore = useAuthStore()
  console.log('➡️ Middleware triggered on', to.path)

  if (authStore.user) {
    console.log('✅ User déjà en store', authStore.user)
    return
  }

  try {
    const { user } = await $fetch('/api/auth/me')
    console.log('✅ API /me retourne', user)
    authStore.user = user
  } catch (err) {
    console.error('❌ Erreur /me', err)
    return navigateTo('/login')
  }
})
