import { prisma } from '~/lib/prisma'
import { comparePassword, generateToken } from '~/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body
    if (!email || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email and password are required'
      })
    }
    
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user || !user.password || !(await comparePassword(password, user.password))) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid credentials'
      })
    }
    
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