<script setup lang="ts">
import type { Task } from '@/types/tasks'
import draggable from 'vuedraggable'

const tasksStore = useTasksStore()
const usersStore = useUsersStore()
const componentsStore = useComponentsStore()

const isdisplayModalOpen = ref(false)
const displayMode = ref<'list' | 'grid'>('list')
const filterOpen = ref(false)
const assigneeModalOpen = ref(false)
const currentTask = ref<Task | null>(null)
const showTaskPopup = ref(false)
const displayTriggerElement = ref<HTMLElement | null>(null)

// États pour les popups globaux (mode grid)
const prioritySelectorOpen = ref(false)
const statusSelectorOpen = ref(false)
const priorityTriggerElement = ref<HTMLElement | null>(null)
const statusTriggerElement = ref<HTMLElement | null>(null)
const popupTask = ref<Task | null>(null)

const isDragging = ref(false)

const { tasks: storeTasks, loading: tasksLoading } = storeToRefs(tasksStore)
const { users: storeUsers } = storeToRefs(usersStore)
const { components: storeComponents } = storeToRefs(componentsStore)

// Cache local pour les optimistic updates
const optimisticTasks = ref<Task[]>([])

// Utiliser les tâches optimistes si disponibles, sinon le store
const tasks = computed(() => optimisticTasks.value.length > 0 ? optimisticTasks.value : storeTasks.value)
const users = computed(() => storeUsers.value)
const components = computed(() => storeComponents.value)

// Synchroniser les tâches optimistes avec le store
watch(storeTasks, (newTasks: Task[]) => {
  if (!isDragging.value && newTasks.length > 0) {
    optimisticTasks.value = [...newTasks]
  }
}, { immediate: true, deep: true })

const taskStatuses = [
  { key: 'Todo', label: 'To Do', color: '#0ea5e9' },
  { key: 'In progress', label: 'In Progress', color: '#facc15' },
  { key: 'Technical Review', label: 'Technical Review', color: '#22c55e' },
  { key: 'Completed', label: 'Completed', color: '#8b5cf6' },
  { key: 'Backlog', label: 'Backlog', color: '#f97316' },
  { key: 'Paused', label: 'Paused', color: '#e11d48' },
]

// Computed pour les tâches groupées avec les tâches locales
const groupedTasks = computed(() =>
  taskStatuses.map((status) => ({
    ...status,
    tasks: tasks.value.filter((task: Task) => task.status === status.key),
  }))
)

// Fonction de mise à jour optimiste simple
function updateTaskOptimistically(taskId: string, updates: Partial<Task>) {
  const taskIndex = optimisticTasks.value.findIndex((t: Task) => t.id === taskId)
  if (taskIndex !== -1) {
    // Créer une nouvelle référence pour déclencher la réactivité
    const updatedTask = { 
      ...optimisticTasks.value[taskIndex], 
      ...updates,
      // Re-enrichir avec assignee si nécessaire
      assignee: updates.lead_id 
        ? users.value.find(u => u.id === updates.lead_id) || null
        : optimisticTasks.value[taskIndex].assignee
    }
    
    optimisticTasks.value = [
      ...optimisticTasks.value.slice(0, taskIndex),
      updatedTask,
      ...optimisticTasks.value.slice(taskIndex + 1)
    ]
  }
}

// Fonction de rollback en cas d'erreur
async function rollbackTask(taskId: string) {
  try {
    // Recharger les données depuis le serveur
    await tasksStore.fetchTasks()
    // Réinitialiser le cache optimiste
    optimisticTasks.value = [...storeTasks.value]
  } catch (error) {
    console.error('Error during rollback:', error)
  }
}

// Fonction de synchronisation en arrière-plan avec rollback
async function syncTaskUpdate(taskId: string, updates: Partial<Task>) {
  try {
    await tasksStore.updateTask(taskId, updates)
    console.log('✅ Task synced successfully')
  } catch (error) {
    console.error('❌ Error syncing task:', error)
    // Rollback optimiste en cas d'erreur
    await rollbackTask(taskId)
    useToast().error('Failed to update task')
  }
}

// Gestion du drag and drop avec mise à jour optimiste
function handleDragChange(evt: any, targetStatus: string) {
  if (evt.added) {
    const task = evt.added.element as Task
    const oldStatus = task.status
    
    // Mise à jour optimiste immédiate
    updateTaskOptimistically(task.id, { status: targetStatus })
    
    // Synchronisation en arrière-plan
    syncTaskUpdate(task.id, { status: targetStatus })
    
    console.log(`🔄 Task "${task.title}" moved from "${oldStatus}" to "${targetStatus}"`)
  }
}

// Gestion du début et fin de drag
function handleDragStart() {
  isDragging.value = true
}

function handleDragEnd() {
  isDragging.value = false
}

// Computed pour chaque colonne avec v-model optimisé
const todoTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'Todo'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'Todo')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'Todo' }))]
  }
})

const inProgressTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'In progress'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'In progress')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'In progress' }))]
  }
})

const technicalReviewTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'Technical Review'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'Technical Review')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'Technical Review' }))]
  }
})

const completedTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'Completed'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'Completed')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'Completed' }))]
  }
})

const backlogTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'Backlog'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'Backlog')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'Backlog' }))]
  }
})

const pausedTasks = computed({
  get: () => tasks.value.filter((task: Task) => task.status === 'Paused'),
  set: (newTasks: Task[]) => {
    const otherTasks = tasks.value.filter((task: Task) => task.status !== 'Paused')
    optimisticTasks.value = [...otherTasks, ...newTasks.map(task => ({ ...task, status: 'Paused' }))]
  }
})

// Map pour accéder facilement aux listes
const taskLists = {
  'Todo': todoTasks,
  'In progress': inProgressTasks,
  'Technical Review': technicalReviewTasks,
  'Completed': completedTasks,
  'Backlog': backlogTasks,
  'Paused': pausedTasks,
}

function openAssigneeModal(task: Task) {
  currentTask.value = task
  assigneeModalOpen.value = true
}

function openPrioritySelector(data: { task: Task; triggerElement: HTMLElement }) {
  popupTask.value = data.task
  priorityTriggerElement.value = data.triggerElement
  prioritySelectorOpen.value = true
}

function openStatusSelector(data: { task: Task; triggerElement: HTMLElement }) {
  popupTask.value = data.task
  statusTriggerElement.value = data.triggerElement
  statusSelectorOpen.value = true
}

function closePrioritySelector() {
  prioritySelectorOpen.value = false
  popupTask.value = null
  priorityTriggerElement.value = null
}

function closeStatusSelector() {
  statusSelectorOpen.value = false
  popupTask.value = null
  statusTriggerElement.value = null
}

const openDisplayMode = () => {
  isdisplayModalOpen.value = true
}

onMounted(async () => {
  if (!storeTasks.value.length) await tasksStore.fetchTasks()
  if (!storeUsers.value.length) await usersStore.fetchUsers()
  if (!storeComponents.value.length) await componentsStore.fetchComponents()
})
</script>

<template>
  <div class="task-management-app h-screen flex flex-col overflow-hidden">
    <header class="flex justify-between items-center p-4 border-b border-bordercolor text-white flex-shrink-0">
      <div class="flex items-center gap-4">
        <UButton
          class="flex gap-3 cursor-pointer items-center"
          variant="ghost"
          @click="filterOpen = true"
        >
          <UIcon name="uil:filter" class="text-2xl" />
          <span class="text-base">Filter</span>
        </UButton>
      </div>
      <div class="flex gap-3 items-center relative">
        <UButton
          ref="displayTriggerElement"
          class="flex gap-1a cursor-pointer items-center"
          variant="ghost"
          @click="openDisplayMode"
        >
          <UIcon name="uil:sliders-v" class="text-xl" />
          <span class="text-base">Display</span>
        </UButton>
        <DisplayMode
          v-if="isdisplayModalOpen"
          :trigger-element="displayTriggerElement"
          @close="isdisplayModalOpen = false"
          @update:model-value="(val: 'list' | 'grid') => (displayMode = val)"
        />
      </div>
    </header>

    <main class="flex-1 overflow-hidden">
      <!-- Loading uniquement au premier chargement -->
      <div v-if="tasksLoading && !tasks.length" class="text-center text-gray-400 p-4">
        Loading tasks and users...
      </div>
      <template v-else>
        <!-- Mode Liste -->
        <div v-if="displayMode === 'list'" class="h-full overflow-y-auto p-4">
          <div class="relative w-full flex flex-end justify-end mb-4">
            <UButton
              variant="ghost"
              class="hover:bg-white/10 p-2 cursor-pointer rounded-xl mr-2"
              @click="showTaskPopup = true"
            >
              <UIcon name="uil:plus" class="text-2xl" />
            </UButton>
          </div>
          
          <!-- Mode liste avec drag and drop optimisé -->
          <div v-for="status in groupedTasks" :key="status.key">
            <h1
              class="text-xl text-white flex items-center justify-between gap-2 my-5 py-3 px-5 rounded"
              :style="{ backgroundColor: status.color + '10' }"
            >
              <div class="flex items-center gap-4 relative">
                <IconTaskStatus :stroke-color="status.color" transform-status="rotate(-90 7 7)" />
                <span class="flex gap-4">
                  <span>{{ status.label }}</span> 
                  <span>{{ status.tasks.length }}</span>
                </span>
              </div>
            </h1>

            <draggable
              v-model="taskLists[status.key].value"
              group="tasks"
              item-key="id"
              class="min-h-[50px] pb-4"
              :animation="200"
              :delay="0"
              :force-fallback="false"
              ghost-class="ghost-task"
              chosen-class="chosen-task"
              drag-class="drag-task"
              @start="handleDragStart"
              @end="handleDragEnd"
              @change="(evt) => handleDragChange(evt, status.key)"
            >
              <template #item="{ element: task }">
                <div class="mb-3 cursor-move">
                  <TaskItem
                    :task="task"
                    :display-mode="displayMode"
                    :users="users"
                    :components="components"
                    :status-color="status.color"
                    @open-assignee="openAssigneeModal(task)"
                  />
                </div>
              </template>
            </draggable>
          </div>
        </div>

        <!-- Mode Grille -->
        <div v-if="displayMode === 'grid'" class="h-full flex flex-col">
          <!-- Bouton d'ajout de tâche en position fixe -->
          <div class="flex-shrink-0 p-4 pb-2">
            <div class="relative w-full flex flex-end justify-end">
              <UButton
                variant="ghost"
                class="hover:bg-white/10 p-2 cursor-pointer rounded-xl mr-2"
                @click="showTaskPopup = true"
              >
                <UIcon name="uil:plus" class="text-2xl" />
              </UButton>
            </div>
          </div>

          <!-- Conteneur des colonnes avec hauteur calculée -->
          <div class="flex-1 overflow-hidden px-4 pb-4">
            <div class="flex gap-4 overflow-x-auto h-full">
              <div 
                v-for="status in taskStatuses" 
                :key="status.key" 
                class="min-w-80 flex-shrink-0 flex flex-col h-full"
              >
                <!-- En-tête de colonne (hauteur fixe) -->
                <div class="flex-shrink-0 mb-4">
                  <div
                    class="flex items-center justify-between p-3 rounded-lg"
                    :style="{ backgroundColor: status.color + '20' }"
                  >
                    <div class="flex items-center gap-3">
                      <IconTaskStatus
                        :stroke-color="status.color"
                        transform-status="rotate(-90 7 7)"
                      />
                      <span class="text-white font-medium">{{ status.label }}</span>
                      <span class="text-gray-400 text-sm">{{ taskLists[status.key].value.length }}</span>
                    </div>
                    <UButton
                      variant="ghost"
                      class="hover:bg-white/10 p-1 cursor-pointer rounded"
                      @click="showTaskPopup = true"
                    >
                      <UIcon name="uil:plus" class="text-lg" />
                    </UButton>
                  </div>
                </div>

                <!-- Zone des tâches avec drag and drop optimisé -->
                <div class="flex-1 overflow-y-auto pr-2">
                  <draggable
                    v-model="taskLists[status.key].value"
                    group="tasks"
                    item-key="id"
                    class="space-y-3 min-h-[200px] pb-4"
                    :animation="200"
                    :delay="0"
                    :force-fallback="false"
                    ghost-class="ghost-task"
                    chosen-class="chosen-task"
                    drag-class="drag-task"
                    @start="handleDragStart"
                    @end="handleDragEnd"
                    @change="(evt) => handleDragChange(evt, status.key)"
                  >
                    <template #item="{ element: task }">
                      <div class="cursor-move">
                        <TaskItem
                          :task="task"
                          :display-mode="displayMode"
                          :users="users"
                          :components="components"
                          :status-color="status.color"
                          @open-assignee="openAssigneeModal"
                          @open-priority-selector="openPrioritySelector"
                          @open-status-selector="openStatusSelector"
                        />
                      </div>
                    </template>
                  </draggable>
                  
                  <!-- Zone de drop vide -->
                  <div
                    v-if="taskLists[status.key].value.length === 0"
                    class="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center text-gray-400 min-h-[200px] flex items-center justify-center"
                  >
                    <span class="text-sm">Drop tasks here<br>{{ status.label }} is empty</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </main>
    
    <CreateTask 
      v-if="showTaskPopup" 
      :users="users" 
      @close="showTaskPopup = false" 
    />

    <!-- Popups globaux -->
    <PrioritySelector
      v-if="prioritySelectorOpen && popupTask"
      :task="popupTask"
      :trigger-element="priorityTriggerElement"
      @close="closePrioritySelector"
    />
    
    <StatusSelector
      v-if="statusSelectorOpen && popupTask"
      :task="popupTask"
      :trigger-element="statusTriggerElement"
      @close="closeStatusSelector"
    />
  </div>
</template>

<style scoped>
/* Styles pour la scrollbar dans les colonnes */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Styles pour la scrollbar horizontale */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}

/* Styles optimisés pour le drag and drop */
.ghost-task {
  opacity: 0.5;
  background: rgba(79, 70, 229, 0.2);
  border: 2px dashed #4f46e5;
  border-radius: 8px;
}

.chosen-task {
  cursor: grabbing !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  z-index: 9999;
  transition: all 0.2s ease;
}

.drag-task {
  cursor: grabbing !important;
  opacity: 0.9;
}

/* Améliorer la zone de grab */
.cursor-move {
  cursor: grab;
}

.cursor-move:active {
  cursor: grabbing;
}

/* Assurer une hauteur minimale pour les zones de drop */
.min-h-[50px] {
  min-height: 50px;
}

.min-h-[200px] {
  min-height: 200px;
}

/* Animation fluide pour les transitions */
.sortable-ghost {
  background: rgba(79, 70, 229, 0.1) !important;
  border: 2px dashed #4f46e5 !important;
  border-radius: 8px !important;
}

/* Styles pour rendre le drag plus réactif */
* {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

/* Permettre la sélection du texte dans les inputs */
input, textarea {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}
</style>