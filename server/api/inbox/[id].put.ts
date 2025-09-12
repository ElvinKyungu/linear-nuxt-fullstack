import { defineEventHandler, readBody, getCookie, createError } from 'h3'
import { notifications } from '@/data/inbox'
import type { Notifications } from '@/types/inbox'

const DELAY = 100

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth-token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  await new Promise((r) => setTimeout(r, DELAY))

  const id = Number(event.context.params?.id)
  const body = await readBody<Partial<Notifications>>(event)

  const idx = notifications.findIndex((n) => n.id === id)
  if (idx === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Notification not found' })
  }

  notifications[idx] = { ...notifications[idx], ...body }

  return {
    data: notifications[idx]
  }
})
