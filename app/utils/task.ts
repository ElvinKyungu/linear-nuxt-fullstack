export function enrichTasks(taskList: Task[] = tasks): Task[] {
  return taskList.map(task => ({
    ...task,
    assignee: task.leadId ? users.find(u => u.id === task.leadId) || null : null,
    component: task.componentId ? components.find(c => c.id === task.componentId) || null : null
  }))
}