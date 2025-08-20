// stores/user.ts
import { defineStore } from 'pinia'
import { useSupabaseClient } from '#imports'
import { useErrorHandler } from '@/composables/useErrorHandler'
import type { User } from '@/types/user'

export const useUsersStore = defineStore('users', () => {
  const client = useSupabaseClient()
  const { handleError } = useErrorHandler('Users Store')

  const users = ref<User[]>([])
  const loading = ref(false)

  const generateAvatarUrl = (seed: string) =>
    `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(seed)}`

  const fetchUsers = async () => {
    loading.value = true
    try {
      const { data, error } = await client
        .from('users')
        .select('id, name, last_name, email, avatar_url')
        .order('created_at', { ascending: false })

      if (error) throw error

      users.value = (Array.isArray(data) ? data : []).map((u: any) => ({
        ...(typeof u === 'object' && u !== null ? u : {}),
        avatarUrl:
          u && u.avatar_url
            ? u.avatar_url
            : generateAvatarUrl(`${u?.name ?? ''} ${u?.last_name ?? ''}`),
      }))
    } catch (err) {
      handleError(err)
    } finally {
      loading.value = false
    }
  }

  return { users, loading, fetchUsers }
})
