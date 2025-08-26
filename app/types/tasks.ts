import type { User } from './users'
import type { Component } from './components'
export interface Task {
  id: string
  title: string
  description?: string
  status: 'Todo' | 'In progress' | 'Technical Review' | 'Completed' | 'Backlog' | 'Paused'
  type: 'Feature' | 'Bug' | 'Design' | 'Documentation' | 'Performance' | 'Security' | 'Refactor' | 'Accessibility'
  priority: 'No priority' | 'Low' | 'Medium' | 'High' | 'Urgent'
  leadId?: string
  assignee?: User | null
  progress: number
  targetDate?: Date
  createdAt: Date
  updatedAt: Date
  componentId?: string
  component?: Component | null
}