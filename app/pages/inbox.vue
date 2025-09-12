<template>
  <NuxtLayout>
    <div class="flex h-screen bg-primary text-white overflow-hidden">
      <!-- Sidebar des notifications -->
      <div 
        ref="sidebar"
        class="bg-primary border-r border-bordercolor flex flex-col relative transition-all duration-200 ease-out will-change-auto"
        :style="{ 
          width: sidebarWidth + 'px', 
          minWidth: '0px',
          transform: sidebarWidth < 50 ? 'translateX(-100%)' : 'translateX(0)',
          opacity: sidebarWidth < 50 ? 0 : 1
        }"
      >
        <!-- Header -->
        <div class="p-4 border-b border-gray-700 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2 min-w-0">
            <Icon name="uil:bell" class="text-orange-500 w-5 h-5 flex-shrink-0" />
            <span 
              class="font-semibold transition-all duration-200 whitespace-nowrap overflow-hidden"
              :style="{ 
                opacity: sidebarWidth > 80 ? 1 : 0,
                width: sidebarWidth > 80 ? 'auto' : '0px'
              }"
            >
              Inbox
            </span>
          </div>
          <div 
            class="flex items-center gap-2 transition-all duration-200"
            :style="{ 
              opacity: sidebarWidth > 120 ? 1 : 0,
              transform: sidebarWidth > 120 ? 'scale(1)' : 'scale(0)'
            }"
          >
            <button class="p-1 rounded hover:bg-gray-700" @click="openCreate">
              <Icon name="uil:plus" class="w-4 h-4 text-gray-300" />
            </button>
            <Icon name="uil:ellipsis-h" class="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <!-- Navigation tabs -->
        <div 
          class="flex border-b border-gray-700 shrink-0 transition-all duration-200"
          :style="{ 
            opacity: sidebarWidth > 100 ? 1 : 0,
            height: sidebarWidth > 100 ? 'auto' : '0px',
            overflow: 'hidden'
          }"
        >
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 hover:bg-gray-700 whitespace-nowrap"
            :class="{ 
              'text-white border-b-2 border-orange-500': activeTab === tab.id,
              'text-gray-400': activeTab !== tab.id
            }"
          >
            <Icon :name="tab.icon" class="w-4 h-4 flex-shrink-0" />
            <span 
              class="transition-all duration-200 overflow-hidden"
              :style="{ 
                opacity: sidebarWidth > 140 ? 1 : 0,
                width: sidebarWidth > 140 ? 'auto' : '0px'
              }"
            >
              {{ tab.name }}
            </span>
          </button>
        </div>

        <!-- Notifications list -->
        <div class="flex-1 overflow-y-auto overflow-x-hidden">
          <div v-if="loading" class="p-4 text-center text-gray-400">Chargement...</div>

          <div
            v-for="notification in visibleNotifications"
            :key="notification.id"
            @click="select(notification)"
            class="flex items-center gap-3 p-3 border-b border-gray-700 hover:bg-gray-750 cursor-pointer transition-all duration-150 relative"
            :class="{ 'bg-gray-700': selectedNotification?.id === notification.id }"
          >
            <!-- Avatar/Icon -->
            <div class="flex-shrink-0">
              <div 
                class="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                :style="{ 
                  backgroundColor: notification.color,
                  transform: sidebarWidth < 70 ? 'scale(0.8)' : 'scale(1)'
                }"
              >
                <Icon :name="notification.icon" class="w-4 h-4 text-white" />
              </div>
            </div>

            <!-- Content -->
            <div 
              class="flex-1 min-w-0 transition-all duration-200"
              :style="{ 
                opacity: sidebarWidth > 70 ? 1 : 0,
                transform: sidebarWidth > 70 ? 'translateX(0)' : 'translateX(-10px)'
              }"
            >
              <div class="flex items-center justify-between mb-1">
                <h4 
                  class="text-sm font-medium text-white overflow-hidden whitespace-nowrap"
                  :title="notification.title"
                  :style="{ 
                    width: getTitleWidth() + 'px'
                  }"
                >
                  {{ truncateText(notification.title, getTitleMaxLength()) }}
                </h4>
                <div class="flex items-center gap-1 flex-shrink-0 ml-2">
                  <Icon 
                    v-if="notification.status === 'completed'" 
                    name="uil:check-circle" 
                    class="w-4 h-4 text-green-400" 
                  />
                  <Icon 
                    v-else-if="notification.status === 'error'" 
                    name="uil:exclamation-triangle" 
                    class="w-4 h-4 text-red-400" 
                  />
                  <Icon 
                    v-else-if="notification.status === 'info'" 
                    name="uil:info-circle" 
                    class="w-4 h-4 text-blue-400" 
                  />
                  <Icon 
                    v-else-if="notification.status === 'warning'" 
                    name="uil:exclamation-circle" 
                    class="w-4 h-4 text-yellow-400" 
                  />
                  <span 
                    class="text-xs text-gray-400 transition-all duration-200 whitespace-nowrap overflow-hidden"
                    :style="{ 
                      opacity: sidebarWidth > 200 ? 1 : 0,
                      width: sidebarWidth > 200 ? 'auto' : '0px'
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
                  width: getDescriptionWidth() + 'px'
                }"
              >
                {{ truncateText(notification.description, getDescriptionMaxLength()) }}
              </p>
            </div>

            <!-- Actions (small) -->
            <div class="flex gap-2 items-center ml-2">
              <button class="p-1 rounded hover:bg-gray-700" @click.stop="edit(notification)">
                <Icon name="uil:edit" class="w-4 h-4 text-gray-300" />
              </button>
              <button class="p-1 rounded hover:bg-gray-700" @click.stop="confirmDelete(notification)">
                <Icon name="uil:trash" class="w-4 h-4 text-gray-300" />
              </button>
            </div>

            <!-- Status indicator for very small widths -->
            <div 
              class="flex-shrink-0 transition-all duration-200"
              :style="{ 
                opacity: sidebarWidth <= 70 ? 1 : 0,
                transform: sidebarWidth <= 70 ? 'scale(1)' : 'scale(0)'
              }"
            >
              <div class="w-2 h-2 rounded-full bg-blue-400"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resize handle -->
      <div
        @mousedown="startResize"
        class="w-1 bg-gray-600 hover:bg-orange-500 cursor-col-resize transition-all duration-200 relative z-10 flex-shrink-0 group"
        :class="{ '!bg-orange-500': isResizing }"
      >
        <!-- Expanded clickable area -->
        <div class="absolute inset-0 w-4 -left-1.5 bg-transparent"></div>
        
        <!-- Visual indicator -->
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div class="flex flex-col items-center gap-1">
            <div class="w-1 h-3 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-1 bg-white rounded-full"></div>
            <div class="w-1 h-3 bg-white rounded-full"></div>
          </div>
        </div>
        
        <!-- Resize indicator when active -->
        <div 
          v-if="isResizing"
          class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div class="flex items-center gap-1 text-white text-xs whitespace-nowrap">
            <Icon name="uil:arrows-h-alt" class="w-3 h-3" />
          </div>
        </div>
      </div>

      <!-- Main content -->
      <div 
        class="flex-1 flex flex-col transition-all duration-200 ease-out min-w-0"
        :style="{ 
          opacity: mainContentWidth < 200 ? 0 : 1,
          transform: mainContentWidth < 200 ? 'translateX(50px)' : 'translateX(0)'
        }"
      >
        <!-- Header -->
        <div class="bg-gray-800 border-b border-gray-700 px-6 py-4 shrink-0">
          <div class="flex items-center justify-between">
            <div class="min-w-0 flex-1">
              <h1 
                class="text-lg font-semibold text-white overflow-hidden whitespace-nowrap"
                :title="selectedNotification?.title || 'Select a notification'"
              >
                {{ selectedNotification?.title || 'Select a notification' }}
              </h1>
              <p 
                class="text-sm text-gray-400 mt-1 overflow-hidden whitespace-nowrap"
                :title="selectedNotification?.status === 'completed' ? 'Reopened by GitHub' : selectedNotification?.description || 'Choose a notification to view details'"
              >
                {{ selectedNotification?.status === 'completed' ? 'Reopened by GitHub' : selectedNotification?.description || 'Choose a notification to view details' }}
              </p>
            </div>
            <div 
              class="flex items-center gap-2 flex-shrink-0 ml-4 transition-all duration-200"
              :style="{ 
                opacity: mainContentWidth > 300 ? 1 : 0,
                transform: mainContentWidth > 300 ? 'scale(1)' : 'scale(0.8)'
              }"
            >
              <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" @click="markSelectedRead" :disabled="!selectedNotification">
                <Icon name="uil:check" class="w-4 h-4 text-gray-400" />
              </button>
              <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" @click="openEditSelected" :disabled="!selectedNotification">
                <Icon name="uil:edit" class="w-4 h-4 text-gray-400" />
              </button>
              <button class="p-2 hover:bg-gray-700 rounded-md transition-colors" @click="selectedNotification && confirmDelete(selectedNotification)">
                <Icon name="uil:trash" class="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        <!-- Content area -->
        <div class="flex-1 p-6 overflow-y-auto">
          <div v-if="selectedNotification && mainContentWidth > 150" class="max-w-2xl">
            <div class="bg-gray-800 rounded-lg p-6 mb-6 transition-all duration-200">
              <div class="flex items-start gap-4">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  :style="{ backgroundColor: selectedNotification.color }"
                >
                  <Icon :name="selectedNotification.icon" class="w-5 h-5 text-white" />
                </div>
                <div class="flex-1 min-w-0">
                  <h2 class="text-lg font-medium text-white mb-2 break-words">{{ selectedNotification.title }}</h2>
                  <p class="text-gray-300 mb-4 break-words">{{ selectedNotification.description }}</p>
                  <div 
                    class="flex items-center gap-4 text-sm text-gray-400 transition-all duration-200"
                    :style="{ 
                      opacity: mainContentWidth > 250 ? 1 : 0.7,
                      fontSize: mainContentWidth > 300 ? '0.875rem' : '0.75rem'
                    }"
                  >
                    <span>{{ selectedNotification.time }}</span>
                    <span>•</span>
                    <span class="capitalize">{{ selectedNotification.status }}</span>
                    <span v-if="selectedNotification.assignee && mainContentWidth > 350">• {{ selectedNotification.assignee }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Additional content based on notification type -->
            <div 
              v-if="selectedNotification.url && mainContentWidth > 250" 
              class="text-sm text-gray-400 transition-all duration-200"
            >
              <a :href="selectedNotification.url" class="text-blue-400 hover:text-blue-300 transition-colors break-all">
                {{ selectedNotification.url }}
              </a>
            </div>
          </div>
          <div v-else class="flex items-center justify-center h-64 text-gray-500">
            <div class="text-center">
              <Icon name="uil:bell" class="w-12 h-12 mx-auto mb-4 text-gray-600" />
              <p>{{ mainContentWidth < 150 ? 'Too narrow' : 'Select a notification to view details' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal create/edit -->
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-gray-900 rounded-md p-4 w-full max-w-lg">
        <h3 class="text-lg font-semibold mb-3">{{ editItem ? 'Modifier notification' : 'Créer notification' }}</h3>
        <div class="grid grid-cols-1 gap-2">
          <input v-model="form.title" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="Titre" />
          <input v-model="form.description" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="Description" />
          <div class="grid grid-cols-2 gap-2">
            <input v-model="form.time" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="time (ex: 2h, 3d)" />
            <input v-model="form.assignee" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="assignee" />
          </div>
          <div class="flex items-center gap-2">
            <input v-model="form.icon" class="p-2 bg-gray-800 border border-gray-700 rounded flex-1" placeholder="icon (uil:...)" />
            <input v-model="form.color" class="p-2 bg-gray-800 border border-gray-700 rounded w-32" placeholder="#hex" />
          </div>
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2">
              <input type="checkbox" v-model="form.isReaded" />
              <span class="text-sm text-gray-300">Lu</span>
            </label>
            <select v-model="form.status" class="p-2 bg-gray-800 border border-gray-700 rounded text-sm">
              <option value="info">info</option>
              <option value="warning">warning</option>
              <option value="completed">completed</option>
              <option value="error">error</option>
            </select>
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <button class="px-3 py-1 rounded hover:bg-gray-800" @click="closeModal">Annuler</button>
          <button class="px-3 py-1 rounded bg-orange-600" @click="submitModal">{{ editItem ? 'Enregistrer' : 'Créer' }}</button>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { Notifications } from '@/types/inbox'
import { storeToRefs } from 'pinia'

/* layout / resize */
const sidebarWidth = ref<number>(320)
const isResizing = ref<boolean>(false)
const containerWidth = ref<number>(1200)
const updateContainerWidth = () => {
  containerWidth.value = window.innerWidth
}
const mainContentWidth = computed(() => Math.max(0, containerWidth.value - sidebarWidth.value - 1))

/* tabs */
const tabs = [
  { id: 'inbox', name: 'Inbox', icon: 'uil:inbox' },
  { id: 'issues', name: 'My issues', icon: 'uil:exclamation-circle' }
]
const activeTab = ref<string>('inbox')

/* store */
const store = useInboxStore()
const { items, loading } = storeToRefs(store) // items = Notification[]
const visibleNotifications = computed(() => items.value) // transform later if needed

/* selection */
const selectedNotification = ref<Notifications | null>(null)

/* modal + form */
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

/* helpers (truncate + widths) */
const truncateText = (text: string | undefined, maxLength: number) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  const truncated = text.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  if (lastSpace > maxLength / 2) return truncated.substring(0, lastSpace) + '...'
  return truncated + '...'
}

const getTitleMaxLength = () => {
  if (sidebarWidth.value <= 80) return 5
  if (sidebarWidth.value <= 120) return 8
  if (sidebarWidth.value <= 180) return 15
  if (sidebarWidth.value <= 240) return 25
  if (sidebarWidth.value <= 300) return 35
  return 50
}

const getDescriptionMaxLength = () => {
  if (sidebarWidth.value <= 80) return 8
  if (sidebarWidth.value <= 120) return 10
  if (sidebarWidth.value <= 180) return 20
  if (sidebarWidth.value <= 240) return 35
  if (sidebarWidth.value <= 300) return 45
  return 60
}

const getTitleWidth = () => Math.max(0, sidebarWidth.value - 120)
const getDescriptionWidth = () => Math.max(0, sidebarWidth.value - 100)

/* resize logic */
const startResize = (e: MouseEvent) => {
  isResizing.value = true
  const startX = e.clientX
  const startSidebarWidth = sidebarWidth.value

  const handleMouseMove = (moveEvent: MouseEvent) => {
    if (!isResizing.value) return
    const deltaX = moveEvent.clientX - startX
    const newWidth = Math.max(48, Math.min(containerWidth.value - 100, startSidebarWidth + deltaX))
    sidebarWidth.value = newWidth
  }

  const handleMouseUp = () => {
    isResizing.value = false
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  e.preventDefault()
}

/* CRUD actions using store */
async function fetchAll() {
  try {
    await store.fetchAll()
    // default selection like before: try index 8, else first, else null
    if (items.value.length) {
      selectedNotification.value = items.value[8] ?? items.value[0] ?? null
    }
  } catch (err) {
    // erreur gérée dans store
    console.warn(err)
  }
}

function select(notification: Notifications) {
  selectedNotification.value = notification
}

function openCreate() {
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

function openEditSelected() {
  if (!selectedNotification.value) return
  editItem.value = selectedNotification.value
  Object.assign(form, { ...selectedNotification.value })
  showModal.value = true
}

function edit(notification: Notifications) {
  editItem.value = notification
  Object.assign(form, { ...notification })
  showModal.value = true
}

async function submitModal() {
  if (editItem.value) {
    // update
    try {
      const updated = await store.update(editItem.value.id, form)
      selectedNotification.value = updated
    } catch (e) {
      console.error(e)
    }
  } else {
    // create
    try {
      const created = await store.create(form)
      selectedNotification.value = created
    } catch (e) {
      console.error(e)
    }
  }
  showModal.value = false
}

function closeModal() {
  showModal.value = false
}

/* delete helpers */
function confirmDelete(notification: Notifications) {
  const ok = confirm('Supprimer cette notification ?')
  if (!ok) return
  doDelete(notification.id)
}

async function doDelete(id: number) {
  try {
    if (selectedNotification.value?.id === id) {
      selectedNotification.value = items.value[0] ?? null
    }
  } catch (e) {
    console.error(e)
  }
}

/* mark read */
async function markSelectedRead() {
  if (!selectedNotification.value) return
  try {
    const updated = await store.update(selectedNotification.value.id, { isReaded: true })
    selectedNotification.value = updated
  } catch (e) {
    console.error(e)
  }
}

/* lifecycle */
onMounted(() => {
  // fetch data from API via store
  fetchAll()

  // container width
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateContainerWidth)
})
</script>

<style scoped>
.bg-gray-750 {
  background-color: #374151;
}

/* Custom scrollbar */
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

/* Smooth hardware acceleration */
.will-change-auto {
  will-change: transform, opacity, width;
}

/* Prevent text selection during resize */
* {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}
</style>
