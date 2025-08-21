import { prisma } from '~/lib/prisma'
import { hashPassword, generateToken } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, name, lastName } = body
    
    if (!email || !password || !name || !lastName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'All fields are required'
      })
    }
    
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    
    if (existingUser) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User already exists'
      })
    }
    
    const hashedPassword = await hashPassword(password)
    const avatarUrl = `https://api.dicebear.com/9.x/glass/svg?seed=${encodeURIComponent(name + ' ' + lastName)}`
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        lastName,
        avatarUrl
      }
    })
    
    const token = generateToken({
      userId: user.id,
      email: user.email
    })
    
    setCookie(event, 'auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl
      }
    }
  } catch (error) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})