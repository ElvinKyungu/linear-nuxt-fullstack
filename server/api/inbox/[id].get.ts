import { defineEventHandler, getCookie, createError } from 'h3'
import { notifications } from '@/data/inbox'

const DELAY = 100

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await new Promise((r) => setTimeout(r, DELAY))

  const id = Number(event.context.params?.id)
  const item = notifications.find((n) => n.id === id)

  if (!item) {
    throw createError({ statusCode: 404, statusMessage: 'Notification not found' })
  }

  return {
    data: item
  }
})
