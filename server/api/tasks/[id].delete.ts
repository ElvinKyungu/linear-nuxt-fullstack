import { tasks } from '@/data/tasks'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const taskId = getRouterParam(event, 'id')
  const taskIndex = tasks.findIndex((t) => t.id === taskId)

  if (taskIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Task not found',
    })
  }

  // Supprimer la tâche de notre "base de données"
  tasks.splice(taskIndex, 1)

  return {
    data: { success: true },
  }
})
