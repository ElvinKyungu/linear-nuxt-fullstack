// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const { data: sessionData } = useAuth()
  
  const user = computed(() => sessionData.value?.user || null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      await refreshSession()
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    const { signOut } = useAuth()
    await signOut({ callbackUrl: '/login' })
  }

  return {
    user,
    error,
    loading,
    login,
    logout,
  }
})