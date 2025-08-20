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
  
  const tasks = await prisma.task.findMany({
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
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  
  return tasks
})