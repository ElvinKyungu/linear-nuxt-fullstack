import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { hashPassword, generateToken } from '~/utils/auth'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  lastName: z.string().min(1)
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, name, lastName } = signupSchema.parse(body)
    
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
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Signup failed'
    })
  }
})