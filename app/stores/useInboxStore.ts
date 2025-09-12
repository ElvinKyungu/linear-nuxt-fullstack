import { defineStore } from 'pinia'
import type { Notifications } from '~/types/inbox'

export const useInboxStore = defineStore('inbox', {
  state: () => ({
    items: [] as Notifications[],
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      try {
        const res = await $fetch<{ data: Notifications[] }>('/api/inbox')
        this.items = res.data
      } catch (e: any) {
        this.error = e.message || String(e)
      } finally {
        this.loading = false
      }
    },
    async create(payload: Partial<Notification>) {
      const res = await $fetch<{ data: Notifications }>('/api/inbox', {
        method: 'POST',
        body: payload,
      })
      this.items.unshift(res.data)
      return res.data
    },
    async update(id: number, payload: Partial<Notifications>) {
      const res = await $fetch<{ data: Notifications }>(`/api/inbox/${id}`, {
        method: 'PUT',
        body: payload,
      })
      const idx = this.items.findIndex((i: Notifications) => i.id === id)
      if (idx !== -1) this.items[idx] = res.data
      return res.data
    },
    async remove(id: number) {
      const res = await $fetch<{ data: Notifications }>(`/api/inbox/${id}`, {
        method: 'DELETE',
      })
      this.items = this.items.filter((i: Notifications) => i.id !== id)
      return res.data
    },
  },
})
