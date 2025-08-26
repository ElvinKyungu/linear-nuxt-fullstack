// data/tasks.ts
import type { Task } from '~/types/tasks'
import { users } from './users'
import { components } from './components'

export const tasks: Task[] = [
  {
    id: '349cfe94-6f6f-47e7-bd69-c8951a6fe2cc',
    title: 'Add Dark Mode Switcher',
    description: 'Ajouter un bouton pour basculer entre thème clair et sombre.',
    status: 'Technical Review',
    type: 'Feature',
    priority: 'Medium',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 30,
    targetDate: new Date('2025-08-10'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '6f980025-ee51-4a50-b2d4-92074ed81b7e',
  },
  {
    id: '372eb7d7-3512-42fc-85ae-ff3eb977927d',
    title: 'Add Multi-Language Support',
    description: "Ajouter la gestion multilingue pour l'interface.",
    status: 'In progress',
    type: 'Feature',
    priority: 'Medium',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 0,
    targetDate: new Date('2025-08-12'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '2aa4ad69-3ee5-4228-9fd2-6b40ca9ac797',
  },
  {
    id: '3d1889c8-e27f-497b-89d2-b3471f85af06',
    title: 'Redesign Tooltip Styles',
    description: 'Moderniser le style des tooltips.',
    status: 'In progress',
    type: 'Design',
    priority: 'No priority',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 45,
    targetDate: new Date('2025-08-08'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: 'a844d4e0-cc9c-49a0-8d94-1c3bc57cb01f',
  },
  {
    id: '3d3dce53-0c7b-4bab-ad86-d27bc86625c4',
    title: 'Write documentation',
    description: 'Document all API endpoints and frontend components',
    status: 'Paused',
    type: 'Documentation',
    priority: 'Low',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 50,
    targetDate: new Date('2025-07-30'),
    createdAt: new Date('2025-07-15T17:46:43.901Z'),
    updatedAt: new Date('2025-07-15T17:46:43.901Z'),
    componentId: '28d5ccf7-3bd2-4d9c-acc1-baf5f07a5c16',
  },
  {
    id: '4453f8d0-d711-4019-81a8-f9dcba3ff4ca',
    title: 'Fix Tooltip Alignment',
    description: 'Corriger le mauvais alignement des tooltips sur mobile.',
    status: 'Completed',
    type: 'Accessibility',
    priority: 'Medium',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 100,
    targetDate: new Date('2025-07-20'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '6f980025-ee51-4a50-b2d4-92074ed81b7e',
  },
  {
    id: '5a1d4344-41e4-4d14-b777-3c7bc6ad3d20',
    title: 'Implement Auth API',
    description:
      "Créer le backend pour l'authentification et la gestion des sessions.",
    status: 'Paused',
    type: 'Feature',
    priority: 'High',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 40,
    targetDate: new Date('2025-07-15'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '2aa4ad69-3ee5-4228-9fd2-6b40ca9ac797',
  },
  {
    id: '5a2fe4eb-e295-4ea2-ab36-3c69d909480d',
    title: 'Fix API Pagination Bug',
    description: "Résoudre le problème de pagination incorrecte dans l'API.",
    status: 'Completed',
    type: 'Accessibility',
    priority: 'High',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 100,
    targetDate: new Date('2025-07-18'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '28d5ccf7-3bd2-4d9c-acc1-baf5f07a5c16',
  },
  {
    id: '632dc02d-5d05-43ad-9d7d-b36210bf5cbb',
    title: 'Fix Mobile Navigation Bug',
    description: 'Corriger le bug sur la navigation mobile.',
    status: 'Todo',
    type: 'Accessibility',
    priority: 'Low',
    leadId: 'cmel8da040000tx30rlt504pd',
    progress: 90,
    targetDate: new Date('2025-08-03'),
    createdAt: new Date('2025-07-16T17:00:05.016Z'),
    updatedAt: new Date('2025-07-16T17:00:05.016Z'),
    componentId: '6f980025-ee51-4a50-b2d4-92074ed81b7e',
  },
]

// Fonction utilitaire pour enrichir les tâches avec les relations
export function enrichTasks(taskList: Task[] = tasks): Task[] {
  return taskList.map((task) => ({
    ...task,
    assignee: task.leadId
      ? users.find((u) => u.id === task.leadId) || null
      : null,
    component: task.componentId
      ? components.find((c) => c.id === task.componentId) || null
      : null,
  }))
}
