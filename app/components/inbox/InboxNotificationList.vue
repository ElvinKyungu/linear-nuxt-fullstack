<script setup lang="ts">
import type { Notifications } from '@/types/inbox'

const props = defineProps<{
  visibleNotifications: Notifications[]
  loading: boolean
  sidebarWidth: number
  selectedNotification: Notifications | null
}>()

const emit = defineEmits(['selectNotification', 'editNotification', 'confirmDelete'])

const selectNotification = (notification: Notifications) => {
  emit('selectNotification', notification)
}
</script>
<template>
  <div class="flex-1 overflow-y-auto overflow-x-hidden">
    <div v-if="loading" class="p-4 text-center text-gray-400">Chargement...</div>
    <div v-else>
      <InboxNotificationListItem
        v-for="notification in visibleNotifications"
        :key="notification.id"
        :notification="notification"
        :sidebar-width="sidebarWidth"
        :is-selected="selectedNotification?.id === notification.id"
        @click="selectNotification(notification)"
        @edit-notification="$emit('editNotification', notification)"
        @confirm-delete="$emit('confirmDelete', notification)"
      />
    </div>
  </div>
</template>
