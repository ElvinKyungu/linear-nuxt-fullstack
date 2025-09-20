
<script setup lang="ts">
const props = defineProps<{
  task: Task
  users: User[]
  components: Components[]
  displayMode: string
  statusColor?: string
}>()

const leadId = ref<string | null>(props.task.leadId || null)
const priority = ref(props.task.priority)
const status = ref(props.task.status)

const assigneeTrigger = ref<HTMLElement | null>(null)
const priorityTrigger = ref<HTMLElement | null>(null)
const statusTrigger = ref<HTMLElement | null>(null)

const isAssigneePopupOpen = ref(false)
const isLevelSelectorOpen = ref(false)
const isOpenStatusPopup = ref(false)

const assigneeUser = computed(() => props.users.find(u => u.id === leadId.value) || null)
const taskComponent = computed(() => props.components.find(c => c.id === props.task.componentId) || null)

const priorityIcon = computed(() => {
  const map: Record<string, any> = {
    'No priority': resolveComponent('IconsIconNoPriority'),
    Low: resolveComponent('IconsIconLow'),
    Medium: resolveComponent('IconsIconMedium'),
    High: resolveComponent('IconsIconHigh'),
    Urgent: resolveComponent('IconsIconUrgent'),
  }
  return map[priority.value] || resolveComponent('IconNoPriority')
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
  <div :class="displayMode === 'list' ? 'flex justify-between text-white hover:bg-white/5 rounded-md p-2 transition-colors' : 'bg-background border rounded-lg p-4 hover:bg-black/30 transition-colors cursor-pointer'">
    <!-- Partie gauche (status / priorité / titre) -->
    <div class="flex items-center gap-4">
      <!-- Status -->
      <UPopover v-model:open="isOpenStatusPopup" :trigger-element="statusTrigger">
        <UBadge ref="statusTrigger" @click="isOpenStatusPopup=true" class="cursor-pointer text-white">
          <component :is="priorityIcon" />
        </UBadge>
        <template #content>
          <TaskStatusSelect v-model:model-value="status" :task-id="task.id" />
        </template>
      </UPopover>
      <span class="text-gray-400 font-medium hidden md:block">
        {{ task?.leadId }}
      </span>
      <!-- Priority -->
      <UPopover v-model:open="isLevelSelectorOpen" :trigger-element="priorityTrigger">
        <UBadge ref="priorityTrigger" @click="isLevelSelectorOpen=true" class="cursor-pointer flex items-center gap-1 text-white">
          
          <IconsIconTaskStatus
            :stroke-color="status.color"
            transform-status="rotate(-90 7 7)"
          />
        </UBadge>
        <template #content>
          <TaskPrioritySelect v-model:model-value="priority" :task-id="task.id" />
        </template>
      </UPopover>

      <!-- Title -->
      <span class="font-medium">{{ task.title }}</span>
    </div>

    <div class="flex items-center gap-4 text-gray-300">
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
      <div class="text-xs text-gray-400">
        {{ formatDate(task.targetDate) }}
      </div>
      <UPopover v-model:open="isAssigneePopupOpen" :trigger-element="assigneeTrigger">
        <UAvatar ref="assigneeTrigger" :src="assigneeUser?.avatarUrl" @click="isAssigneePopupOpen=true" class="cursor-pointer"/>
        <template #content>
          <TaskAssigneeSelect v-model:model-value="leadId" :task-id="task.id" :users="users" />
        </template>
      </UPopover>
    </div>
  </div>
</template>
