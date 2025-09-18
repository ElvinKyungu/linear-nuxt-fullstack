<script setup lang="ts">
import type { Task } from '@/types/tasks'
import type { User } from '@/types/user'

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
  if (!props.users || !props.task?.leadId) return null
  return props.users.find((user: User) => user.id === props.task.leadId) || null
})

const taskComponent = computed(() => {
  return (
    props.components.find((c: Components) => c.id === props.task.componentId) ||
    null
  )
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
          class="hover:bg-white/10 p-2 text-white cursor-pointer rounded-xl"
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
        <span class="text-gray-400 font-medium hidden md:block">{{
          task?.leadId
        }}</span>
      </div>
      <div class="flex items-center gap-2 font-medium relative">
        <UButton
          ref="priorityTrigger"
          variant="ghost"
          class="hover:bg-white/10 p-2 cursor-pointer rounded-xl"
          @click="openStatusPopup"
        >
          <IconTaskStatus
            :stroke-color="statusColor"
            transform-status="rotate(-90 7 7)"
          />
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
          class="border border-bordercolor/5 bg-black flex items-center gap-2 px-3 text-xs py-1 rounded-full"
        >
          <span
            class="w-2 h-2 rounded-full"
            :class="getTagBgClass(task.type)"
          />
          {{ task.type }}
        </UBadge>
      </div>

      <div class="hidden sm:block text-sm">
        <UBadge
          color="neutral"
          variant="outline"
          size="xs"
          class="border flex items-center gap-2 px-3 text-xs py-1 border-bordercolor/5 rounded-full bg-black"
        >
          <UIcon
            v-if="taskComponent?.name"
            name="i-heroicons-puzzle-piece"
            class="mr-1 text-white hover:cursor-pointer"
          />
          Elvin UI - {{ taskComponent?.name }}
        </UBadge>
      </div>

      <div class="hidden sm:block text-sm text-gray-300">
        {{
          task.targetDate
            ? new Date(task.targetDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'No due date'
        }}
      </div>

      <div class="flex justify-end relative">
        <UChip position="bottom-right">
          <UAvatar
            ref="assigneeTrigger"
            :src="assigneeUser?.avatarUrl"
            :alt="assigneeUser?.name || 'default'"
            size="sm"
            class="cursor-pointer hover:ring-2 hover:ring-primary"
            @click="openAssigneePopup"
          />
        </UChip>
        <TaskAssignSelect
          v-if="isAssigneePopupOpen"
          :users="props.users"
          :model-value="leadId"
          :trigger-element="
            assigneeTrigger ? { $el: assigneeTrigger } : undefined
          "
          @update:model-value="handleAssigneeSelect"
          @close="isAssigneePopupOpen = false"
        />
      </div>
    </div>
  </div>

  <!-- Mode Grille -->
  <div
    v-else-if="displayMode === 'grid'"
    class="bg-background border rounded-lg p-4 hover:bg-black/30 transition-colors cursor-pointer"
  >
    <!-- En-tête de la carte avec icône de statut et ID -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center justify-between gap-2 relative w-full">
        <div class="flex items-center gap-2 relative">
          <UButton
            ref="priorityTrigger"
            variant="ghost"
            class="hover:bg-white/10 p-1 cursor-pointer rounded text-white"
            @click="openStatusPopup"
          >
            <IconsIconTaskStatus
              :stroke-color="statusColor"
              transform-status="rotate(-90 7 7)"
              class="text-white"
            />
          </UButton>
          <span class="text-gray-400 text-sm">{{ task.status }}</span>
        </div>
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
          class="hover:bg-white/10 p-1 cursor-pointer rounded relative text-white"
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
        class="border-[1px] border-bordercolor bg-black flex items-center gap-1 px-2 text-xs py-1 rounded-full"
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
        <IconComponent />
        {{ taskComponent?.name }}
      </UBadge>
    </div>

    <!-- Pied de carte avec date et assigné -->
    <div class="flex items-center justify-between">
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
              v-if="task?.leadId"
              name="i-heroicons-check-circle-20-solid"
              class="absolute -bottom-0.5 -right-0.5 w-4 h-4 text-primary"
            />
          </template>
        </UAvatar>
        <TaskAssignSelect
          v-if="isAssigneePopupOpen"
          :users="props.users"
          :model-value="leadId"
          :trigger-element="
            assigneeTrigger ? { $el: assigneeTrigger } : undefined
          "
          @update:model-value="handleAssigneeSelect"
          @close="isAssigneePopupOpen = false"
        />
      </div>
      <div class="text-xs text-gray-400">
        {{
          task.targetDate
            ? new Date(task.targetDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : 'No due date'
        }}
      </div>
    </div>
  </div>
</template>
