import { prisma } from '~/lib/prisma'
import { verifyToken } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided'
    })
  }
  
  const payload = verifyToken(token)
  if (!payload) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
  
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      avatarUrl: true
    }
  })
  
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }
  
  return { user }
})