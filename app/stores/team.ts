// stores/team.ts
import { defineStore } from 'pinia'
import type { Team } from '~/types/teams'
export const useTeamsStore = defineStore('teams', () => {
  const teams = ref<Team[]>([])
  const loading = ref(false)

  const fetchTeams = async () => {
    loading.value = true
    try {
      const { data } = await $fetch<{ data: Team[] }>('/api/teams')
      teams.value = data || []
    } catch (err) {
      console.error('Error fetching teams:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    fetchTeams,
  }
})
