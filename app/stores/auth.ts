// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)

  const login = async (email: string, password: string) => {
    loading.value = true
    try {
      const { user: loggedUser } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password }
      })
      user.value = loggedUser
      await navigateTo('/')
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' })
      user.value = null
      await navigateTo('/login')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      loading.value = false
    }
  }

  const checkAuth = async () => {
    try {
      const { user: authUser } = await $fetch('/api/auth/me')
      user.value = authUser
      return authUser
    } catch (error) {
      user.value = null
      return null
    }
  }

  return {
    user,
    loading,
    login,
    logout,
    checkAuth
  }
})
