// server/api/auth/profile.patch.ts
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
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
    const userId = payload.userId as string
    const userIndex = users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found',
      })
    }

    const updates = await readBody(event)

    // Valider les updates
    const allowedFields = ['name', 'lastName', 'email']
    const filteredUpdates = Object.keys(updates)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key]
        return obj
      }, {} as any)

    // Vérifier l'unicité de l'email si changé
    if (
      filteredUpdates.email &&
      filteredUpdates.email !== users[userIndex].email
    ) {
      const emailExists = users.some(
        (u) => u.email === filteredUpdates.email && u.id !== userId
      )
      if (emailExists) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Cet email est déjà utilisé',
        })
      }
    }

    // Mettre à jour l'utilisateur
    users[userIndex] = {
      ...users[userIndex],
      ...filteredUpdates,
    }

    // Régénérer l'avatar si le nom a changé
    if (filteredUpdates.name || filteredUpdates.lastName) {
      users[userIndex].avatarUrl =
        `https://ui-avatars.com/api/?name=${encodeURIComponent(users[userIndex].name + ' ' + users[userIndex].lastName)}&background=6366f1&color=ffffff`
    }

    return {
      user: {
        id: users[userIndex].id,
        name: users[userIndex].name,
        lastName: users[userIndex].lastName,
        email: users[userIndex].email,
        avatarUrl: users[userIndex].avatarUrl,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token',
    })
  }
})
