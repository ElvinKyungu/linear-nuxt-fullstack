// server/api/auth/avatar.post.ts
import { users } from '~/data/users'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided'
    })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string, email: string }
    const userIndex = users.findIndex(u => u.id === decoded.userId)

    if (userIndex === -1) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    // En production, vous devriez gérer l'upload de fichiers
    // Pour cette démo, on génère juste un nouvel avatar aléatoire
    const user = users[userIndex]
    const colors = ['6366f1', 'ec4899', '10b981', 'f59e0b', 'ef4444', '8b5cf6']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    
    users[userIndex].avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name + ' ' + user.lastName)}&background=${randomColor}&color=ffffff`

    return {
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        lastName: users[userIndex].lastName,
        email: users[userIndex].email,
        avatarUrl: users[userIndex].avatarUrl
      }
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})