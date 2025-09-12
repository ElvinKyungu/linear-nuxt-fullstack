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
          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="selectedNotification = notification"
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
              <button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
                <Icon name="uil:paperclip" class="w-4 h-4 text-gray-400" />
              </button>
              <button class="p-2 hover:bg-gray-700 rounded-md transition-colors">
                <Icon name="uil:message" class="w-4 h-4 text-gray-400" />
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
  </NuxtLayout>
</template>

<script setup>
const sidebarWidth = ref(320)
const isResizing = ref(false)
const selectedNotification = ref(null)
const activeTab = ref('inbox')
const containerWidth = ref(1200) // Default container width

const mainContentWidth = computed(() => {
  return Math.max(0, containerWidth.value - sidebarWidth.value - 1) // -1 for resize handle
})

const tabs = [
  { id: 'inbox', name: 'Inbox', icon: 'uil:inbox' },
  { id: 'issues', name: 'My issues', icon: 'uil:exclamation-circle' }
]

const notifications = ref([
  {
    id: 1,
    title: 'Refactor Button component for full accessibility compliance',
    description: "I've attached the new design mockup",
    time: '10h',
    status: 'warning',
    icon: 'uil:refresh',
    color: '#10b981',
    assignee: 'uhih'
  },
  {
    id: 2,
    title: 'Optimize animations for smoother UI transitions',
    description: 'Section renamed from Animations to UI Transitions',
    time: '4d',
    status: 'completed',
    icon: 'uil:play',
    color: '#ec4899',
    assignee: null
  },
  {
    id: 3,
    title: 'Implement dark mode toggle with system preferences support',
    description: 'Reopened by GitHub',
    time: '6d',
    status: 'info',
    icon: 'uil:moon',
    color: '#84cc16',
    assignee: null
  },
  {
    id: 4,
    title: 'Design new modal system with focus trapping',
    description: 'https://github.com/ElvinKyungu/linear-nuxt-fullstack',
    time: '13d',
    status: 'info',
    icon: 'uil:layer-group',
    color: '#8b5cf6',
    url: 'https://github.com/ElvinKyungu/linear-nuxt-fullstack'
  },
  {
    id: 5,
    title: 'Enhance responsiveness of Navbar',
    description: 'Tested on mobile and it works perfectly now',
    time: '11d',
    status: 'warning',
    icon: 'uil:mobile-android',
    color: '#10b981'
  },
  {
    id: 6,
    title: 'Optimize loading time of Footer',
    description: 'Updated performance metrics in the documentation',
    time: '18d',
    status: 'completed',
    icon: 'uil:rocket',
    color: '#10b981'
  },
  {
    id: 7,
    title: 'Refactor Sidebar for better accessibility',
    description: 'Closed by Linear',
    time: '4w',
    status: 'info',
    icon: 'uil:sidebar',
    color: '#84cc16'
  },
  {
    id: 8,
    title: 'Implement new Card component design',
    description: 'Closed by Linear',
    time: '4w',
    status: 'completed',
    icon: 'uil:credit-card',
    color: '#84cc16'
  },
  {
    id: 9,
    title: 'Dashboard: adapt breadcrumb text in feature view',
    description: 'Reopened by GitHub',
    time: '6w',
    status: 'info',
    icon: 'uil:dashboard',
    color: '#10b981'
  }
])

// Fonction pour mettre à jour la largeur du conteneur
const updateContainerWidth = () => {
  containerWidth.value = window.innerWidth
}

// Fonction pour démarrer le redimensionnement
const startResize = (e) => {
  isResizing.value = true
  const startX = e.clientX
  const startSidebarWidth = sidebarWidth.value
  
  const handleMouseMove = (moveEvent) => {
    if (isResizing.value) {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(0, Math.min(containerWidth.value - 100, startSidebarWidth + deltaX))
      sidebarWidth.value = newWidth
    }
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

// Fonctions pour tronquer le texte
const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text
  
  // Try to break at word boundaries
  const truncated = text.substring(0, maxLength - 3)
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSpace > maxLength / 2) {
    return truncated.substring(0, lastSpace) + '...'
  }
  
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

const getTitleWidth = () => {
  return Math.max(0, sidebarWidth.value - 120)
}

const getDescriptionWidth = () => {
  return Math.max(0, sidebarWidth.value - 100)
}

// Initialisation
onMounted(() => {
  if (notifications.value.length > 0) {
    selectedNotification.value = notifications.value[8] // Dashboard notification
  }
  updateContainerWidth()
  window.addEventListener('resize', updateContainerWidth)
})

// Nettoyage
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