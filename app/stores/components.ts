import { defineStore } from 'pinia'
import type { Component } from '@/types/components'

export const useComponentsStore = defineStore('components', () => {
  const client = useSupabaseClient()
  const components = ref<Component[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 🔥 Fetch all components
  async function fetchComponents() {
    loading.value = true
    error.value = null
    try {
      const { data, error: fetchError } = await client
        .from('component')
        .select('id, name, color')
        .order('name', { ascending: true })

      if (fetchError) throw fetchError
      components.value = data || []
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      loading.value = false
    }
  }

  return {
    components,
    loading,
    error,
    fetchComponents,
  }
})
