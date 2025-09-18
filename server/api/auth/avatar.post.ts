// server/api/auth/avatar.post.ts
import { users } from '@/data/users'
import { jwtVerify } from 'jose'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    })
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    )
    const userId = payload.userId as string
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      })
    }

    // En production, gérer l'upload réel
    const user = users[userIndex]
    const colors = ['6366f1', 'ec4899', '10b981', 'f59e0b', 'ef4444', '8b5cf6']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    users[userIndex].avatarUrl =
      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name + ' ' + user.lastName)}&background=${randomColor}&color=ffffff`

    return {
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        lastName: users[userIndex].lastName,
        email: users[userIndex].email,
        avatarUrl: users[userIndex].avatarUrl,
      },
    }
  } catch {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }
})
