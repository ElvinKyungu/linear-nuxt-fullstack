export interface Project {
  id: string
  title: string
  health: string
  priority: string
  lead: string
  status: string
  startDate: string
  percentComplete: number
  icon: any
}
export interface Health {
  id: string
  title: string
  color: string
  description: string
}