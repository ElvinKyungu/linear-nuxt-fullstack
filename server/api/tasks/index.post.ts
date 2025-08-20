import { z } from 'zod'
import { prisma } from '~/lib/prisma'
import { verifyToken } from '~/utils/auth'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.string().default('Todo'),
  type: z.string().default('Feature'),
  priority: z.string().default('No priority'),
  leadId: z.string().optional(),
  componentId: z.string().optional(),
  targetDate: z.string().optional().transform(val => val ? new Date(val) : undefined)
})

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  
  if (!token || !verifyToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }
  
  try {
    const body = await readBody(event)
    const data = createTaskSchema.parse(body)
    
    const task = await prisma.task.create({
      data,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            lastName: true,
            email: true,
            avatarUrl: true
          }
        },
        component: true
      }
    })
    
    return task
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: error instanceof Error ? error.message : 'Failed to create task'
    })
  }
})