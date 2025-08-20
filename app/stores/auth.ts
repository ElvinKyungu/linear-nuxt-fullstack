// stores/auth.ts
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()

  const error = ref<string | null>(null)
  const loading = ref(false)

  async function signup(email: string, password: string, name: string, lastName: string) {
    loading.value = true
    error.value = null

    const { data, error: signUpError } = await client.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      error.value = signUpError.message
      loading.value = false
      return false
    }

    const userId = data.user?.id
    if (userId) {
      await client.from('users').insert({
        id: userId,
        email,
        name,
        last_name: lastName,
        avatar_url: '',
      })
    }

    loading.value = false
    return true
  }

  async function login(email: string, password: string) {
    loading.value = true
    error.value = null

    const { error: loginError } = await client.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      error.value = loginError.message
      loading.value = false
      return false
    }

    loading.value = false
    return true
  }

  async function logout() {
    await client.auth.signOut()
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
