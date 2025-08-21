// stores/tasks.ts
import { defineStore } from 'pinia'
import type { Task } from '@/types/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const usersStore = useUsersStore()
  const { handleError } = useErrorHandler('Tasks Store')

  const tasks = ref<Task[]>([])
  const loading = ref(false)

  const enrichTasks = (rawTasks: any[]): Task[] =>
    rawTasks.map((t) => ({
      ...t,
      // Adapter selon la structure de votre API
      // Si votre API retourne déjà l'assignee, utilisez-le directement
      assignee: t.assignee || usersStore.users.find((u) => u.id === t.lead_id) || null,
    }))

  const fetchTasks = async () => {
    loading.value = true
    try {
      const { data } = await $fetch<Task[]>('/api/tasks', {
        method: 'GET',
        credentials: 'include', // Important pour envoyer les cookies
      })
      
      tasks.value = enrichTasks(data || [])
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const addTask = async (task: Partial<Task>) => {
    loading.value = true
    try {
      await $fetch('/api/tasks', {
        method: 'POST',
        body: task,
        credentials: 'include',
      })
      
      // Recharger les tâches après ajout
      await fetchTasks()
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTask = async (id: string, updates: Partial<Task>) => {
    loading.value = true
    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'PATCH', // ou PUT selon votre API
        body: updates,
        credentials: 'include',
      })
      
      // Recharger les tâches après mise à jour
      await fetchTasks()
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTask = async (id: string) => {
    loading.value = true
    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      
      // Recharger les tâches après suppression
      await fetchTasks()
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Version optimisée pour les optimistic updates
  const updateTaskOptimized = async (id: string, updates: Partial<Task>) => {
    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: updates,
        credentials: 'include',
      })

      // Pas de fetchTasks() ici - les optimistic updates gèrent l'UI
      return true
    } catch (err) {
      handleError(err)
      throw err // Important pour déclencher le rollback
    }
  }

  return {
    tasks,
    loading,
    fetchTasks,
    addTask,
    updateTask,
    deleteTask,
    updateTaskOptimized,
  }
})