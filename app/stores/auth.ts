import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref<string | null>(null)
  const loading = ref(false)
  const session = computed(() => user.value)
  // Vérifier si l'utilisateur est connecté

  async function signup(email: string, password: string, name: string, lastName: string) {
    loading.value = true
    error.value = null

    try {
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Signup failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    try {
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await navigateTo('/login')
  }

  return {
    user,
    error,
    loading,
    checkAuth,
    login,
    signup,
    logout,
    session
  }
})