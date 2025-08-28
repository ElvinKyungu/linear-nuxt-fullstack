// server/api/auth/me.get.ts
import { users } from '~/data/users'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables")
}

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided',
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string
      email: string
    }
    const user = users.find((u) => u.id === decoded.userId)

    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      })
    }

    return {
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    }
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }
})
