
// server/api/auth/login.post.ts
import { users } from '~/data/users'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  // Simulation de validation simple (en prod, utilisez bcrypt)
  const user = users.find(u => u.email === email)
  
  if (!user || password !== 'password123') {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid credentials'
    })
  }

  // Créer le token JWT
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )

  // Définir le cookie
  setCookie(event, 'auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 jours
  })

  return {
    user: {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      avatarUrl: user.avatarUrl
    }
  }
})
