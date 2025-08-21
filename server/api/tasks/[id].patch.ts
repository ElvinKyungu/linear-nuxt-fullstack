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
  const body = await readBody(event)

  if (!taskId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Task ID is required'
    })
  }

  try {
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        ...body,
        updatedAt: new Date(),
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            avatarUrl: true
          }
        },
        component: true
      }
    })

    return { data: task }
  } catch (error) {
    console.error('Error updating task:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update task'
    })
  }
})
