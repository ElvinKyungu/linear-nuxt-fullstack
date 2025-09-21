export default function getPriorityIcon(priority: number) {
  const config = getPriorityConfig(priority)
  return priorityIcons[config?.icon] || priorityIcons.IconNoPriority
}