import { health } from '~/data/projects'
export default defineEventHandler(async () => {
  // Simule un appel API réel
  await new Promise((resolve) => setTimeout(resolve, 300))

  // Retourne les données locales
  const { projects } = await import('~/data/projects')
  return projects.map((project) => ({
    ...project,
    health: project.health || health[0],
    priority: project.priority || 'Medium',
    lead: project.lead || 'ELVIN-CODE-001',
    status: project.status || 'Todo',
  }))
})
