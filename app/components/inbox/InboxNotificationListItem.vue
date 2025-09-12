<script setup lang="ts">
import type { Notifications } from '@/types/inbox'
import { users } from '~/data/users'

const props = defineProps<{
  notification: Notifications
  sidebarWidth: number
  isSelected: boolean
}>()

const emit = defineEmits([
  'select-notification',
  'edit-notification',
  'confirm-delete',
])

/* Helper Functions */
const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > maxLength / 2)
    return truncated.substring(0, lastSpace) + '...'
  return truncated + '...'
}

const getTitleMaxLength = () => {
  if (props.sidebarWidth <= 80) return 5
  if (props.sidebarWidth <= 120) return 8
  if (props.sidebarWidth <= 180) return 15
  if (props.sidebarWidth <= 240) return 25
  if (props.sidebarWidth <= 300) return 35
  return 50
}

const getDescriptionMaxLength = () => {
  if (props.sidebarWidth <= 80) return 8
  if (props.sidebarWidth <= 120) return 10
  if (props.sidebarWidth <= 180) return 20
  if (props.sidebarWidth <= 240) return 35
  if (props.sidebarWidth <= 300) return 45
  return 60
}

const getTitleWidth = () => Math.max(0, props.sidebarWidth - 120)
const getDescriptionWidth = () => Math.max(0, props.sidebarWidth - 100)
</script>
<template>
  <div
    class="flex items-center gap-3 p-3 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-all duration-150 relative"
    :class="{ 'bg-gray-700': isSelected }"
    @click="$emit('select-notification', notification)"
  >
    <div class="flex-shrink-0 relative">
      <UAvatar
        :src="
          users.find((u) => u.id === notification.assignee)?.avatarUrl ||
          '/images/gab.jpg'
        "
        :alt="
          users.find((u) => u.id === notification.assignee)?.name ||
          'Aucun utilisateur'
        "
        size="lg"
        class="ring-2 ring-black"
      />
      <div
        class="w-6 flex justify-center items-center h-6 absolute -bottom-1 -right-1 bg-[#222] rounded-full p-1"
      >
        <Icon
          :name="notification.icon"
          class="w-5 h-5 text-white"
          :style="`color:${notification.color} `"
        />
      </div>
    </div>

    <div
      class="flex-1 min-w-0 transition-all duration-200"
      :style="{
        opacity: sidebarWidth > 70 ? 1 : 0,
        transform: sidebarWidth > 70 ? 'translateX(0)' : 'translateX(-10px)',
      }"
    >
      <div class="flex items-center justify-between mb-1">
        <h4
          class="text-sm font-medium text-white overflow-hidden whitespace-nowrap"
          :title="notification.title"
          :style="{
            width: getTitleWidth() + 'px',
          }"
        >
          {{ truncateText(notification.title, getTitleMaxLength()) }}
        </h4>
        <div class="flex items-center gap-1 flex-shrink-0 ml-2">
          <IconTaskStatus
            v-if="notification.status === 'completed'"
            stroke-color="#8b5cf6"
            transform-status="rotate(-90 7 7)"
          />
          <IconTaskStatus
            v-else-if="notification.status === 'paused'"
            stroke-color="#e11d48"
            transform-status="rotate(-90 7 7)"
          />
          <IconTaskStatus
            v-else-if="notification.status === 'in progress'"
            stroke-color="#facc15"
            transform-status="rotate(-90 7 7)"
          />
          <IconTaskStatus
            v-else-if="notification.status === 'technical review'"
            stroke-color="#22c55e"
            transform-status="rotate(-90 7 7)"
          />
          <IconBacklog
            v-else-if="notification.status === 'backlog'"
            class="text-[#22c55e]"
          />
          <IconTodo
            v-else-if="notification.status === 'todo'"
            class="text-[#22c55e]"
          />
          <span
            class="text-xs text-gray-400 transition-all duration-200 whitespace-nowrap overflow-hidden"
            :style="{
              opacity: sidebarWidth > 200 ? 1 : 0,
              width: sidebarWidth > 200 ? 'auto' : '0px',
            }"
          >
            {{ notification.time }}
          </span>
        </div>
      </div>
      <p
        class="text-xs text-gray-400 overflow-hidden whitespace-nowrap"
        :title="notification.description"
        :style="{
          width: getDescriptionWidth() + 'px',
        }"
      >
        {{ truncateText(notification.description, getDescriptionMaxLength()) }}
      </p>
    </div>
    <div
      class="flex-shrink-0 transition-all duration-200"
      :style="{
        opacity: sidebarWidth <= 70 ? 1 : 0,
        transform: sidebarWidth <= 70 ? 'scale(1)' : 'scale(0)',
      }"
    >
      <div class="w-2 h-2 rounded-full bg-blue-400"></div>
    </div>
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: #374151;
}
</style>
