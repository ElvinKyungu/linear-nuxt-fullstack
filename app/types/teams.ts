export type TeamMember = {
  userId: string
  role: 'Admin' | 'Member' | 'Guest'
}

export type Team = {
  id: string
  name: string
  membership: string
  identifier: string
  members: TeamMember[]
  projects: number
  componentId: string
}
