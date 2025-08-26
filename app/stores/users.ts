// stores/users.ts
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', () => {
  const users = ref<User[]>([])
  const loading = ref(false)

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data } = await $fetch<{ data: User[] }>('/api/users')
      users.value = data || []
    } catch (err) {
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    users,
    loading,
    fetchUsers
  }
})