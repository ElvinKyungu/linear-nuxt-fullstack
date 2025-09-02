import { users } from '@/data/users'
import { jwtVerify } from 'jose'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'No token' })

  try {
    const encoder = new TextEncoder()
    const { payload } = await jwtVerify(token, encoder.encode(JWT_SECRET))
    const user = users.find((u) => u.id === payload.userId)

    if (!user)
      throw createError({ statusCode: 401, statusMessage: 'User not found' })

    return {
      user: {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    }
  } catch {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
