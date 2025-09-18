<script setup lang="ts">
import type { Notifications } from '@/types/inbox'

defineProps<{
  sidebarWidth: number
  selectedNotification: Notifications | null
}>()

const emit = defineEmits([
  'select-notification',
  'open-create-modal',
  'confirm-delete',
  'open-edit-modal',
])

/* Delete confirmation */
const showDeleteModal = ref(false)
const notificationToDelete = ref<Notifications | null>(null)

/* Toast */

/* Store pour la suppression */
const store = useInboxStore()
const { items } = storeToRefs(store)

/* Tabs */
const tabs = [
  { id: 'inbox', name: 'Inbox', icon: 'uil:inbox' },
  { id: 'issues', name: 'My issues', icon: 'uil:exclamation-circle' },
]
const activeTab = ref<string>('inbox')

/* Store */
const { loading } = storeToRefs(store)
const visibleNotifications = computed(() => items.value)

/* Methods */
const selectNotification = (notification: Notifications) => {
  emit('select-notification', notification)
}

const editNotification = (notification: Notifications) => {
  // L'édition se passe dans le parent (InboxLayout)
  // On remonte l'événement
  emit('open-edit-modal', notification)
}

const confirmDelete = (notification: Notifications) => {
  notificationToDelete.value = notification
  showDeleteModal.value = true
}


</script>
<template>
  <div
    class="bg-primary border-r border-bordercolor flex flex-col relative transition-all duration-200 ease-out will-change-auto"
    :style="{
      width: sidebarWidth + 'px',
      minWidth: '0px',
      transform: sidebarWidth < 50 ? 'translateX(-100%)' : 'translateX(0)',
      opacity: sidebarWidth < 50 ? 0 : 1,
    }"
  >
    <div
      class="p-4 border-b border-gray-700 flex items-center justify-between shrink-0"
    >
      <div class="flex items-center gap-2 min-w-0">
        <Icon name="uil:bell" class="text-orange-500 w-5 h-5 flex-shrink-0" />
        <span
          class="font-semibold transition-all duration-200 whitespace-nowrap overflow-hidden"
          :style="{
            opacity: sidebarWidth > 80 ? 1 : 0,
            width: sidebarWidth > 80 ? 'auto' : '0px',
          }"
        >
          Inbox
        </span>
      </div>
      <div
        class="flex items-center gap-2 transition-all duration-200"
        :style="{
          opacity: sidebarWidth > 120 ? 1 : 0,
          transform: sidebarWidth > 120 ? 'scale(1)' : 'scale(0)',
        }"
      >
        <button
          class="p-1 rounded hover:bg-gray-700"
          @click="$emit('open-create-modal')"
        >
          <Icon name="uil:plus" class="w-4 h-4 text-gray-300" />
        </button>
        <Icon name="uil:ellipsis-h" class="w-4 h-4 text-gray-400" />
      </div>
    </div>

    <div
      class="flex border-b border-gray-700 shrink-0 transition-all duration-200"
      :style="{
        opacity: sidebarWidth > 100 ? 1 : 0,
        height: sidebarWidth > 100 ? 'auto' : '0px',
        overflow: 'hidden',
      }"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-700 whitespace-nowrap"
        :class="{
          'text-white border-b-2 border-teal-500': activeTab === tab.id,
          'text-gray-400': activeTab !== tab.id,
        }"
        @click="activeTab = tab.id"
      >
        <Icon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
        <span
          class="transition-all duration-200 overflow-hidden"
          :style="{
            opacity: sidebarWidth > 140 ? 1 : 0,
            width: sidebarWidth > 140 ? 'auto' : '0px',
          }"
        >
          {{ tab.name }}
        </span>
      </button>
    </div>

    <InboxNotificationList
      :sidebar-width="sidebarWidth"
      :selected-notification="selectedNotification"
      :visible-notifications="visibleNotifications"
      :loading="loading"
      @select-notification="selectNotification"
      @edit-notification="editNotification"
      @confirm-delete="confirmDelete"
    />

    <!-- Modal de confirmation de suppression -->
    <!-- <UModal v-model="showDeleteModal">
      <UCard :ui="{ 
        background: 'bg-white dark:bg-gray-900',
        body: { padding: 'px-4 py-5 sm:p-6' }
      }">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-red-500 w-5 h-5" />
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Confirmer la suppression
            </h3>
          </div>
        </template>

        <div class="space-y-3">
          <p class="text-gray-600 dark:text-gray-300">
            Êtes-vous sûr de vouloir supprimer la notification 
            <span class="font-semibold text-gray-900 dark:text-white">
              "{{ notificationToDelete?.title }}"
            </span> ?
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Cette action est irréversible et supprimera définitivement cette notification.
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              @click="cancelDelete"
              color="gray"
              variant="ghost"
              label="Annuler"
              size="sm"
            />
            <UButton
              @click="proceedDelete"
              color="red"
              label="Supprimer"
              icon="i-heroicons-trash"
              size="sm"
            />
          </div>
        </template>
      </UCard>
    </UModal> -->
  </div>
</template>

<style scoped>
.bg-gray-750 {
  background-color: #374151;
}
</style>
