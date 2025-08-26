// stores/components.ts
import { defineStore } from 'pinia'

export const useComponentsStore = defineStore('components', () => {
  const components = ref<Component[]>([])
  const loading = ref(false)

  const fetchComponents = async () => {
    loading.value = true
    try {
      const { data } = await $fetch<{ data: Component[] }>('/api/components')
      components.value = data || []
    } catch (err) {
      console.error('Error fetching components:', err)
    } finally {
      loading.value = false
    }
  }

  return {
    components,
    loading,
    fetchComponents,
  }
})
