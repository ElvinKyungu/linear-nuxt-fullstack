<script setup lang="ts">
import type { Notifications } from '@/types/inbox'

/* Layout / Resize Logic */
const {
  sidebarWidth,
  isResizing,
  mainContentWidth,
  startResize
} = useInboxResize()

/* Store */
const store = useInboxStore()
const { items, loading } = storeToRefs(store)

/* Selection */
const selectedNotification = ref<Notifications | null>(null)

/* Modal + Form */
const showModal = ref(false)
const editItem = ref<Notifications | null>(null)
const form = reactive<Partial<Notifications>>({
  title: '',
  description: '',
  time: '',
  isReaded: false,
  icon: 'uil:bell',
  color: '#6b7280',
  assignee: '',
  status: 'info',
  url: ''
})

/* Methods */
const selectNotification = (notification: Notifications) => {
  selectedNotification.value = notification
}

async function fetchAll() {
  try {
    await store.fetchAll()
    if (items.value.length) {
      selectedNotification.value = items.value[8] ?? items.value[0] ?? null
    }
  } catch (err) {
    console.warn(err)
  }
}

const openCreateModal = () => {
  editItem.value = null
  Object.assign(form, {
    title: '',
    description: '',
    time: 'now',
    isReaded: false,
    icon: 'uil:bell',
    color: '#6b7280',
    assignee: '',
    status: 'info',
    url: ''
  })
  showModal.value = true
}

const openEditSelectedModal = () => {
  if (!selectedNotification.value) return
  editItem.value = selectedNotification.value
  Object.assign(form, { ...selectedNotification.value })
  showModal.value = true
}

const editNotification = (notification: Notifications) => {
  editItem.value = notification
  Object.assign(form, { ...notification })
  showModal.value = true
}

async function submitModal() {
  if (editItem.value) {
    try {
      const updated = await store.update(editItem.value.id, form)
      selectedNotification.value = updated
    } catch (e) {
      console.error(e)
    }
  } else {
    try {
      const created = await store.create(form)
      selectedNotification.value = created
    } catch (e) {
      console.error(e)
    }
  }
  closeModal()
}

const closeModal = () => {
  showModal.value = false
}

const confirmDelete = (notification: Notifications) => {
  const ok = confirm('Supprimer cette notification ?')
  if (!ok) return
  doDelete(notification.id)
}

async function doDelete(id: number) {
  try {
    await store.remove(id)
    if (selectedNotification.value?.id === id) {
      selectedNotification.value = items.value[0] ?? null
    }
  } catch (e) {
    console.error(e)
  }
}

async function markSelectedRead() {
  if (!selectedNotification.value) return
  try {
    const updated = await store.update(selectedNotification.value.id, { isReaded: true })
    selectedNotification.value = updated
  } catch (e) {
    console.error(e)
  }
}

/* Lifecycle */
onMounted(() => {
  fetchAll()
})
</script>
<template>
  <NuxtLayout>
    <div class="flex h-screen bg-primary text-white overflow-hidden">
      <InboxSidebar
        :sidebar-width="sidebarWidth"
        :selected-notification="selectedNotification"
        @select-notification="selectNotification"
        @open-create-modal="openCreateModal"
      />

      <div
        @mousedown="startResize"
        class="w-1 bg-gray-600 hover:bg-orange-500 cursor-col-resize transition-all duration-200 relative z-10 flex-shrink-0 group"
        :class="{ '!bg-orange-500': isResizing }"
      >
        <div class="absolute inset-0 w-4 -left-1.5 bg-transparent"></div>
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div class="flex flex-col items-center gap-1">
            <div class="w-1 h-3 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        <div v-if="isResizing" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="flex items-center gap-1 text-white text-xs whitespace-nowrap">
            <Icon name="uil:arrows-h-alt" class="w-3 h-3" />
          </div>
        </div>
      </div>

      <InboxMainContent 
        :selected-notification="selectedNotification"
        :main-content-width="mainContentWidth"
        @mark-read="markSelectedRead"
        @open-edit-modal="openEditSelectedModal"
        @confirm-delete="confirmDelete"
      />
    </div>

    <InboxModal
      v-if="showModal"
      :form-data="form"
      :edit-item="editItem"
      @close-modal="closeModal"
      @submit-modal="submitModal"
    />
  </NuxtLayout>
</template>

<style scoped>
/* Custom scrollbar and other global styles */
::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #1f2937;
}
::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: #6b7280;
}
.will-change-auto {
  will-change: transform, opacity, width;
}
* {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>