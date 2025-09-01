// server/api/team.ts
import { teams } from '@/data/teams'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  return {
    data: teams,
  }
})
