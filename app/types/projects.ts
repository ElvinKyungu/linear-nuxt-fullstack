export interface Project {
  id: string
  title: string
  health: Health
  priority: string
  lead: string
  status: string
  startDate: string
  percentComplete: number
}
export interface Health {
  id: 'no-update' | 'off-track' | 'on-track' | 'at-risk'
  title: string
  color: string
  description: string
}