// server/api/tasks/index.post.ts
import { tasks, enrichTasks } from '~/data/tasks'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const body = await readBody(event)

  const newTask = {
    id: crypto.randomUUID(),
    ...body,
    progress: body.progress || 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Ajouter à notre "base de données" en mémoire
  tasks.push(newTask)

  // Retourner la tâche enrichie
  const enrichedTasks = enrichTasks()
  const createdTask = enrichedTasks.find((t) => t.id === newTask.id)

  return {
    data: createdTask,
  }
})
