import { prisma } from '~/lib/prisma'
import { verifyToken } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token || !verifyToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const taskId = getRouterParam(event, 'id')

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required'
    })
  }

  try {
    await prisma.task.delete({
      where: { id: taskId }
    })

    return { data: { success: true } }
  } catch (error) {
    console.error('Error deleting task:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete task'
    })
  }
})