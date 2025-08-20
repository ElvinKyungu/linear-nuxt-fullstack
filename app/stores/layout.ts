// stores/layout.ts
import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', () => {
  const isExtended = ref(false)
  const toggleExtend = () => { isExtended.value = !isExtended.value }
  return { isExtended, toggleExtend }
})
