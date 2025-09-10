import { defineStore } from 'pinia'
import type { Project, Health } from '~/types/projects'
import { health } from '~/data/projects'
import { users } from '~/data/users'
export const useProjectStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    error: null as string | null
  }),

  actions: {
    async fetchProjects() {
      this.loading = true
      try {
        // Simulation d'un appel API
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Charger les données depuis le fichier local
        const { projects } = await import('~/data/projects')
        this.projects = projects.map(project => ({
          ...project,
          health: project.health || health[0],
          priority: project.priority || 'Medium',
          lead: project.lead || 'ELVIN-CODE-001',
          status: project.status || 'Todo'
        }))
      } catch (err) {
        this.error = 'Failed to load projects'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    updateProject(id: string, updates: Partial<Project>) {
      const index = this.projects.findIndex(p => p.id === id)
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updates }
      }
    },

    updateHealth(id: string, healthId: string) {
      const healthItem = health.find(h => h.id === healthId)
      if (healthItem) {
        this.updateProject(id, { health: healthItem })
      }
    },

    updatePriority(id: string, priority: string) {
      this.updateProject(id, { priority })
    },

    updateLead(id: string, leadId: string) {
      const lead = users.find(u => u.id === leadId)
      if (lead) {
        this.updateProject(id, { lead: lead.id })
      }
    },

    updateStatus(id: string, status: string) {
      this.updateProject(id, { status })
    }
  }
})