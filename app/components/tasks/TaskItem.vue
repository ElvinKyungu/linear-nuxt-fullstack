
<script setup lang="ts">
const props = defineProps<{
  task: Task
  users: User[]
  components: Components[]
  displayMode: string
  statusColor?: string
}>()


const assigneeTrigger = ref<HTMLElement | null>(null)
const priorityTrigger = ref<HTMLElement | null>(null)
const statusTrigger = ref<HTMLElement | null>(null)

const isAssigneePopupOpen = ref(false)
const isLevelSelectorOpen = ref(false)
const isOpenStatusPopup = ref(false)

const assigneeUser = computed(() => props.users.find(u => u.id === props.task.leadId) || null)
const taskComponent = computed(() => props.components.find(c => c.id === props.task.componentId) || null)

const priorityIcon = computed(() => {
  const map: Record<string, any> = {
    'No priority': resolveComponent('IconsIconNoPriority'),
    Low: resolveComponent('IconsIconLow'),
    Medium: resolveComponent('IconsIconMedium'),
    High: resolveComponent('IconsIconHigh'),
    Urgent: resolveComponent('IconsIconUrgent'),
  }
  return map[props.task.priority] || resolveComponent('IconsIconNoPriority')
})

const statusIcon = computed(() => {
  const map: Record<string, any> = {
    'Todo': resolveComponent('IconsIconTodo'),
    'In progress': resolveComponent('IconsIconTaskStatus'),
    'Technical Review': resolveComponent('IconsIconTaskStatus'),
    'Completed': resolveComponent('IconsIconTaskStatus'),
    'Backlog': resolveComponent('IconsIconBacklog'),
    'Paused': resolveComponent('IconsIconTaskStatus'),
  }
  return map[props.task.status] || resolveComponent('IconsIconTaskStatus')
})

const statusColor = computed(() => {
  const map: Record<string, string> = {
    'Todo': '#0ea5e9',
    'In progress': '#facc15',
    'Technical Review': '#22c55e',
    'Completed': '#8b5cf6',
    'Backlog': '#f97316',
    'Paused': '#e11d48',
  }
  return map[props.task.status] || '#0ea5e9'
})

const getTagBgClass = (tag: string) => {
  const map: Record<string, string> = {
    Bug: 'bg-testing',
    Testing: 'bg-development',
    Design: 'bg-design',
    Documentation: 'bg-deployment',
    Performance: 'bg-research',
    Accessibility: 'bg-marketing',
    Refactor: 'bg-review',
    Other: 'bg-other',
  }
  return map[tag] || 'bg-other'
}
</script>

<template>
  <div
    class="w-full"
    :class="displayMode === 'list'
      ? 'flex justify-between text-white hover:bg-white/5 rounded-md p-2 transition-colors'
      : 'bg-background border border-bordercolor rounded-lg p-4 hover:bg-black/30 transition-colors cursor-pointer flex flex-col gap-2'"
  >
    <div class="flex items-center gap-1" :class="displayMode !== 'list' ? 'justify-between' : ''">
      <div class="flex items-center gap-2">
        <UPopover v-model:open="isLevelSelectorOpen" :trigger-element="priorityTrigger">
          <UBadge ref="priorityTrigger" class="cursor-pointer text-white" @click="isLevelSelectorOpen = true">
            <component :is="priorityIcon" />
          </UBadge>
          <template #content>
            <TaskPrioritySelect :model-value="task.priority" :task-id="task.id" @close="isLevelSelectorOpen = false" />
          </template>
        </UPopover>

        <!-- ID -->
        <span class="text-gray-400 text-sm font-bold" :class="displayMode==='list' ? 'hidden lg:flex' : ''">
          {{ task?.leadId }}
        </span>
      </div>
      <!-- Priority -->
      <UPopover v-model:open="isOpenStatusPopup" :trigger-element="statusTrigger">
        <UBadge ref="statusTrigger" class="cursor-pointer flex items-center gap-1 text-white" @click="isOpenStatusPopup = true">
          <component :is="statusIcon"
            :stroke-color="statusColor"
            transform-status="rotate(-90 7 7)"
          />
        </UBadge>
        <template #content>
          <TaskStatusSelect :model-value="task.status" :task-id="task.id" @close="isOpenStatusPopup = false" />
        </template>
      </UPopover>
      <span v-if="displayMode === 'list'" class="font-medium text-white">
        {{ task.title }}
      </span>
    </div>
    <span v-if="displayMode !== 'list'" class="font-medium text-white">
      {{ task.title }}
    </span>
    <div :class="displayMode==='list' ? 'flex items-center gap-2 text-gray-300 text-sm' : 'flex flex-col justify-between gap-2 text-gray-300 text-sm space-y-2'" >
      <div class="flex flex-wrap items-center gap-2 text-gray-300" :class="displayMode==='list' ? 'hidden lg:flex' : 'pt-2'">
            <UBadge class="border text-white flex items-center gap-1 px-3 text-xs py-1 border-bordercolor rounded-full bg-black">
              <span class="w-2 h-2 rounded-full" :class="getTagBgClass(task.type)" />
              {{ task.type }}
            </UBadge>

            <UBadge class="border text-white flex items-center gap-1 px-3 text-xs py-1 border-bordercolor rounded-full bg-black">
              <UIcon
                v-if="taskComponent?.name"
                name="i-heroicons-puzzle-piece"
                class="mr-1 text-white hover:cursor-pointer"
              />
              Elvin UI - {{ taskComponent?.name }}
            </UBadge>
          </div>
          <div class="flex items-center justify-between gap-2 text-gray-300">
            <div class="text-xs text-gray-400" :class="displayMode==='list' ? 'hidden lg:flex' : ''">
              {{ formatDate(task.targetDate) }}
            </div>

            <UPopover v-model:open="isAssigneePopupOpen" :trigger-element="assigneeTrigger">
              <UAvatar
                ref="assigneeTrigger"
                :src="assigneeUser?.avatarUrl"
                class="cursor-pointer"
                :chip="{
                  inset: true,
                  color: 'success',
                  position: 'bottom-right',
                  class: 'border-0 ring-0 border-background ring-2 ring-black',
                }"
                @click="isAssigneePopupOpen = true"
              />
              <template #content>
                <TaskAssigneeSelect :model-value="task.leadId" :task-id="task.id" :users="users" @close="isAssigneePopupOpen = false"/>
              </template>
            </UPopover>
          </div>
    </div>
  </div>
</template>
