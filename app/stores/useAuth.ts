// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const handleError = (err: unknown, fallback = 'Erreur') => {
    if (err instanceof Error) return err.message
    if (typeof err === 'object' && err !== null && 'data' in err) {
      //"@ts-expect-error"
      return err.data?.message || fallback
    }
    return fallback
  }

  const login = async (email: string, password: string) => {
    loading.value = true
    error.value = null
    try {
      const { user: loggedUser } = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      user.value = loggedUser
      await navigateTo('/')
      return loggedUser
    } catch (err: unknown) {
      error.value = handleError(err, 'Erreur de connexion')
      throw err
    } finally {
      loading.value = false
    }
  }

  const signup = async (
    email: string,
    password: string,
    name: string,
    lastName: string
  ) => {
    loading.value = true
    error.value = null
    try {
      const { user: newUser } = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: { email, password, name, lastName },
      })
      user.value = newUser
      return newUser
    } catch (err: unknown) {
      error.value = handleError(err, "Erreur lors de l'inscription")
      throw err
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
    } catch (err: unknown) {
      console.error('Logout error:', handleError(err))
    } finally {
      loading.value = false
    }
  }

    const checkAuth = async () => {
      try {
        const { user: authUser } = await $fetch('/api/auth/me', {
          headers: useRequestHeaders(['cookie']), // important for SSR
        })
        user.value = authUser
        return authUser
      } catch {
        user.value = null
        return null
      }
    }


  const updateProfile = async (updates: Partial<User>) => {
    loading.value = true
    error.value = null
    try {
      const { user: updatedUser } = await $fetch('/api/auth/profile', {
        method: 'PATCH',
        body: updates,
      })
      user.value = updatedUser
      return updatedUser
    } catch (err: unknown) {
      error.value = handleError(err, 'Erreur lors de la mise à jour')
      throw err
    } finally {
      loading.value = false
    }
  }

  const uploadAvatar = async (file: File) => {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('avatar', file)
      const { user: updatedUser } = await $fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData,
      })
      user.value = updatedUser
      return updatedUser
    } catch (err: unknown) {
      error.value = handleError(err, "Erreur lors de l'upload")
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    checkAuth,
    updateProfile,
    uploadAvatar,
  }
})
