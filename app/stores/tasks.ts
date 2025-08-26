// stores/tasks.ts - Version simplifiée sans Prisma
import { defineStore } from 'pinia'
import type { Task } from '~/data/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const { handleError } = useErrorHandler('Tasks Store')
  const tasks = ref<Task[]>([])
  const loading = ref(false)

  const fetchTasks = async () => {
    loading.value = true
    try {
      const { data } = await $fetch<{ data: Task[] }>('/api/tasks', {
        method: 'GET'
      })
      tasks.value = data || []
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
      const { data } = await $fetch<{ data: Task }>('/api/tasks', {
        method: 'POST',
        body: task
      })
      
      // Ajouter la nouvelle tâche à la liste
      if (data) {
        tasks.value.unshift(data)
      }
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
      const { data } = await $fetch<{ data: Task }>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: updates
      })
      
      // Mettre à jour la tâche dans la liste
      if (data) {
        const index = tasks.value.findIndex(t: => t.id === id)
        if (index !== -1) {
          tasks.value[index] = data
        }
      }
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
        method: 'DELETE'
      })
      
      // Supprimer la tâche de la liste
      tasks.value = tasks.value.filter(t => t.id !== id)
    } catch (err) {
      handleError(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTaskOptimized = async (id: string, updates: Partial<Task>) => {
    try {
      await $fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: updates
      })
      return true
    } catch (err) {
      handleError(err)
      throw err
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