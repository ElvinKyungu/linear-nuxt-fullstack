import { users } from '@/data/users'
import { SignJWT } from 'jose'

const config = useRuntimeConfig()
const JWT_SECRET = config.jwtSecret

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const user = users.find((u) => u.email === email)

  if (!user || password !== 'password123') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials',
    })
  }

  // Créer le token JWT compatible edge
  const encoder = new TextEncoder()
  const token = await new SignJWT({ userId: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('7d')
    .sign(encoder.encode(JWT_SECRET))

  // Définir le cookie
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
  }
})
