import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const error = ref<string | null>(null)
  const loading = ref(false)

  async function signup(email: string, password: string, name: string, lastName: string) {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: { email, password, name, lastName }
      })
      user.value = data.user
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
      const data = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      user.value = data.user
      return true
    } catch (err: any) {
      error.value = err.data?.message || 'Login failed'
      return false
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/login')
  }

  return {
    user,
    error,
    loading,
    login,
    signup,
    logout,
  }
})