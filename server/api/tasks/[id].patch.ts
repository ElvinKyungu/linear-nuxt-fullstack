// server/api/tasks/[id].patch.ts
import { tasks, enrichTasks } from '~/data/tasks'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const taskId = getRouterParam(event, 'id')
  const updates = await readBody(event)

  const taskIndex = tasks.findIndex(t => t.id === taskId)
  
  if (taskIndex === -1) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Task not found'
    })
  }

  // Mettre à jour la tâche
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updatedAt: new Date()
  }

  // Retourner la tâche enrichie
  const enrichedTasks = enrichTasks()
  const updatedTask = enrichedTasks.find(t => t.id === taskId)

  return {
    data: updatedTask
  }
})