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

  const body = await readBody<Partial<Notifications>>(event)
  const nextId = notifications.length
    ? Math.max(...notifications.map((n) => n.id)) + 1
    : 1

  const newItem: Notifications = {
    id: nextId,
    title: body.title || 'Nouvelle notification', // Corrigé: titre par défaut en français
    description: body.description || '',
    time: body.time || 'now',
    isReaded: !!body.isReaded,
    icon: body.icon || 'uil:bell',
    color: body.color || '#6b7280',
    assignee: body.assignee || '',
    status: body.status || 'info', // Ajouté: propriété status manquante
    url: body.url || '', // Ajouté: propriété url manquante
  }

  notifications.unshift(newItem)

  return {
    data: newItem,
  }
})
