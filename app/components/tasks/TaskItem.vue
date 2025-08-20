<script setup lang="ts">
import type { Task } from '@/types/tasks'
import type { User } from '@/types/user'
import type { Components } from '@/types/components'

const props = defineProps<{
  task: Task
  users: User[]
  components: Components[]
  displayMode: string
  statusColor?: string
}>()
const leadId = ref<string | null>(null)
const emit = defineEmits(['open-assignee', 'update-assignee'])

const assigneeUser = computed(() => {
  if (!props.users || !props.task?.lead_id) return null
  return props.users.find((user: User) => user.id === props.task.lead_id) || null
})

const taskComponent = computed(() => {
  return props.components.find((c: Components) => c.id === props.task.component_id) || null
})

const isAssigneePopupOpen = ref(false)
const assigneeTrigger = ref<HTMLElement | null>(null)

const openAssigneePopup = () => {
  isAssigneePopupOpen.value = true
}
const handleAssigneeSelect = (assignee: User) => {
  emit('update-assignee', { taskId: props.task?.id, assignee })
  isAssigneePopupOpen.value = false
}

const isLevelSelectorOpen = ref(false)
const isOpenStatusPopup = ref(false)
const triggerElementRef = ref<HTMLElement | null>(null)
const priorityTrigger = ref<HTMLElement | null>(null)

const openLevelSelector = () => {
  isLevelSelectorOpen.value = true
}

const handleLevelSelect = () => {
  isLevelSelectorOpen.value = false
}

const priorityIcon = computed(() => {
  const priorityMap: Record<string, any> = {
    'No priority': resolveComponent('IconNoPriority'),
    Low: resolveComponent('IconLow'),
    Medium: resolveComponent('IconMedium'),
    High: resolveComponent('IconHigh'),
    Urgent: resolveComponent('IconUrgent'),
  }
  return priorityMap[props.task.priority] || resolveComponent('NoPriority')
})

const getTagBgClass = (tag: string) => {
  const tagColors: Record<string, string> = {
    Bug: 'bg-testing',
    Testing: 'bg-development',
    Design: 'bg-design',
    Documentation: 'bg-deployment',
    Performance: 'bg-research',
    Accessibility: 'bg-marketing',
    Refactor: 'bg-review',
    Other: 'bg-other',
  }
  return tagColors[tag] || 'bg-other'
}

const openStatusPopup = () => {
  isOpenStatusPopup.value = true
}

// Fonction pour obtenir la couleur du statut
const getStatusColor = () => {
  const statusColors: Record<string, string> = {
    'In progress': '#facc15',
    'Technical Review': '#22c55e',
    Completed: '#8b5cf6',
    Todo: '#0ea5e9',
    Backlog: '#f97316',
    Paused: '#e11d48',
  }
  return statusColors[props.task.status] || '#6b7280'
}
</script>

<template>
  <!-- Mode Liste -->
  <div
    v-if="displayMode === 'list'"
    class="flex justify-between text-white hover:bg-white/5 rounded-md p-2 transition-colors"
  >
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 relative">
        <UButton
          ref="triggerElementRef"
          variant="ghost"
          class="hover:bg-white/10 p-2 cursor-pointer rounded-xl"
          @click="openLevelSelector"
        >
          <component :is="priorityIcon" />
        </UButton>
        <TaskPrioritySelector
          v-if="isLevelSelectorOpen"
          :tasks="[props.task]"
          :trigger-element="triggerElementRef?.$el ?? triggerElementRef"
          @update:model-value="handleLevelSelect"
          @close="isLevelSelectorOpen = false"
        />
        <span class="text-gray-500 hidden md:block">{{ task?.status }}</span>
      </div>
      <div class="flex items-center gap-2 font-medium relative">
        <UButton
          ref="priorityTrigger"
          variant="ghost"
          class="hover:bg-white/10 p-2 cursor-pointer rounded-xl"
          @click="openStatusPopup"
        >
          <IconTaskStatus :stroke-color="statusColor" transform-status="rotate(-90 7 7)" />
        </UButton>
        <span>{{ task?.title }}</span>
        <TaskStatusSelector
          v-if="isOpenStatusPopup"
          :trigger-element="priorityTrigger"
          @close="isOpenStatusPopup = false"
        />
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="hidden sm:flex gap-1">
        <UBadge
          color="neutral"
          variant="outline"
          size="xs"
          class="border border-bordercolor bg-black flex items-center gap-2 px-3 text-xs py-1 rounded-full"
        >
          <span class="w-2 h-2 rounded-full" :class="getTagBgClass(task.type)" />
          {{ task.type }}
        </UBadge>
      </div>

      <div class="hidden sm:block text-sm">
        <UBadge
          color="neutral"
          variant="outline"
          size="xs"
          class="border flex items-center gap-2 px-3 text-xs py-1 border-bordercolor rounded-full bg-black"
        >
          <UIcon v-if="taskComponent?.name" name="i-heroicons-puzzle-piece" class="mr-1" />
          Elvin UI {{ taskComponent?.name }}
        </UBadge>
      </div>

      <div class="hidden sm:block text-sm text-gray-500">
        {{
          task.target_date
            ? new Date(task.target_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'No due date'
        }}
      </div>

      <div class="flex justify-end relative">
        <UChip inset>
          <UAvatar
            ref="assigneeTrigger"
            :src="assigneeUser?.avatarUrl"
            :alt="assigneeUser?.name || 'default'"
            size="sm"
            class="cursor-pointer hover:ring-2 hover:ring-primary"
            @click="openAssigneePopup"
          >
            <template #badge>
              <UIcon
                v-if="task?.lead_id"
                name="i-heroicons-check-circle-20-solid"
                class="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-primary"
              />
            </template>
          </UAvatar>
        </UChip>
        <TaskAssignSelect
          v-if="isAssigneePopupOpen"
          :users="props.users"
          :model-value="leadId"
          :trigger-element="assigneeTrigger ? { $el: assigneeTrigger } : undefined"
          @update:model-value="handleAssigneeSelect"
          @close="isAssigneePopupOpen = false"
        />
      </div>
    </div>
  </div>

  <!-- Mode Grille -->
  <div
    v-else-if="displayMode === 'grid'"
    class="bg-black/20 border border-gray-700 rounded-lg p-4 hover:bg-black/30 transition-colors cursor-pointer"
  >
    <!-- En-tête de la carte avec icône de statut et ID -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 relative">
        <UButton
          ref="priorityTrigger"
          variant="ghost"
          class="hover:bg-white/10 p-1 cursor-pointer rounded"
          @click="openStatusPopup"
        >
          <IconTaskStatus :stroke-color="getStatusColor()" transform-status="rotate(-90 7 7)" />
        </UButton>
        <span class="text-gray-400 text-sm">{{ task.status }}</span>
        <TaskStatusSelector
          v-if="isOpenStatusPopup"
          :trigger-element="priorityTrigger"
          @close="isOpenStatusPopup = false"
        />
      </div>

     <div class="relative">
        <UButton
          ref="triggerElementRef"
          variant="ghost"
          class="hover:bg-white/10 p-1 cursor-pointer rounded relative"
          @click="openLevelSelector"
        >
        <component :is="priorityIcon" />
        </UButton>
        <TaskPrioritySelector
          v-if="isLevelSelectorOpen"
          :tasks="[props.task]"
          :trigger-element="triggerElementRef?.$el ?? triggerElementRef"
          @update:model-value="handleLevelSelect"
          @close="isLevelSelectorOpen = false"
        />
     </div>
    </div>
    <h3 class="text-white font-medium mb-3 line-clamp-2">
      {{ task?.title }}
    </h3>

    <!-- Tags et badges -->
    <div class="flex flex-wrap gap-2 mb-3">
      <UBadge
        color="neutral"
        variant="outline"
        size="xs"
        class="border border-bordercolor bg-black flex items-center gap-1 px-2 text-xs py-1 rounded-full"
      >
        <span class="w-2 h-2 rounded-full" :class="getTagBgClass(task.type)" />
        {{ task.type }}
      </UBadge>

      <UBadge
        v-if="taskComponent?.name"
        color="neutral"
        variant="outline"
        size="xs"
        class="border flex items-center gap-1 px-2 text-xs py-1 border-bordercolor rounded-full bg-black"
      >
        <UIcon name="i-heroicons-puzzle-piece" class="w-3 h-3" />
        {{ taskComponent?.name }}
      </UBadge>
    </div>

    <!-- Pied de carte avec date et assigné -->
    <div class="flex items-center justify-between">
      <div class="text-xs text-gray-400">
        {{
          task.target_date
            ? new Date(task.target_date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'No due date'
        }}
      </div>

      <div class="relative">
        <UAvatar
          ref="assigneeTrigger"
          :src="assigneeUser?.avatarUrl"
          :alt="assigneeUser?.name || 'default'"
          size="sm"
          class="cursor-pointer hover:ring-2 hover:ring-primary"
          @click="openAssigneePopup"
        >
          <template #badge>
            <UIcon
              v-if="task?.lead_id"
              name="i-heroicons-check-circle-20-solid"
              class="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-primary"
            />
          </template>
        </UAvatar>
        <Teleport to="body">
          <TaskAssignSelect
            v-if="isAssigneePopupOpen"
            :users="props.users"
            :model-value="leadId"
            :trigger-element="assigneeTrigger ? { $el: assigneeTrigger } : undefined"
            @update:model-value="handleAssigneeSelect"
            @close="isAssigneePopupOpen = false"
          />
        </Teleport>
      </div>
    </div>
  </div>
</template>
