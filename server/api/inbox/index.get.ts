import { defineEventHandler, getCookie, createError } from 'h3'
import { notifications } from '@/data/inbox'

const DELAY = 100

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // simule latence
  await new Promise((r) => setTimeout(r, DELAY))

  return {
    data: notifications,
  }
})
