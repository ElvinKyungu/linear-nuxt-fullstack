// server/api/tasks/index.get.ts
import { enrichTasks } from '~/data/tasks'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Simuler un délai pour ressembler à une vraie API
  await new Promise((resolve) => setTimeout(resolve, 100))

  return {
    data: enrichTasks(),
  }
})
