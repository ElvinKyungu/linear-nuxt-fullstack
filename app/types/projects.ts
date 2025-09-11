export interface Project {
  id: string
  title: string
  health: Health | ''
  priority: string
  lead: string
  status: 'Todo' | 'In progress' | 'Technical Review' | 'Completed' | 'Backlog' | 'Paused'
  startDate: string
  percentComplete: number
}

export interface Health {
  id: 'no-update' | 'off-track' | 'on-track' | 'at-risk'
  title: string
  color: string
  description: string
  icon: string
}

export interface StatusConfig {
  id: string
  name: string
  icon: string
  color: string
}