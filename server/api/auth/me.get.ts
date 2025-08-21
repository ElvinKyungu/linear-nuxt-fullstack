// server/api/auth/me.get.ts
import { verifyToken } from '~/utils/auth'
import { prisma } from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  console.log('🔍 /api/auth/me appelé')
  
  const token = getCookie(event, 'auth-token')
  console.log('🔍 Token trouvé:', !!token)

  if (!token) {
    console.log('❌ Pas de token dans le cookie')
    throw createError({
      statusCode: 401,
      statusMessage: 'No token provided'
    })
  }

  try {
    const decoded = verifyToken(token)
    console.log('✅ Token décodé:', decoded)

    if (!decoded || !decoded.userId) {
      console.log('❌ Token invalide ou pas d\'userId')
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid token'
      })
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        avatarUrl: true,
        // autres champs nécessaires
      }
    })

    if (!user) {
      console.log('❌ Utilisateur non trouvé en DB')
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }

    console.log('✅ Utilisateur trouvé et retourné:', user)
    return { user }

  } catch (error) {
    console.log('❌ Erreur lors de la vérification:', error)
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }
})