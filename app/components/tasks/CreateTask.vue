<script setup lang="ts">
import type { User } from '@/types/user'
import type { Components } from '@/types/components'

const props = defineProps<{
  users: User[]
  components: Components[]
}>()

const tasksStore = useTasksStore()
const { t } = useI18n()

const popupRef = ref<HTMLElement | null>(null)
const priorityTrigger = ref<HTMLElement | null>(null)
const assigneeTrigger = ref<HTMLElement | null>(null)
const statusTrigger = ref<HTMLElement | null>(null)
const projectTrigger = ref<HTMLElement | null>(null)

const form = reactive({
  title: '',
  description: '',
  status: 'In progress',
  type: 'Feature',
  priority: 'No priority',
  leadId: null as string | null,
  progress: 0,
  targetDate: '',
  componentId: null as string | null,
})

const emit = defineEmits(['close'])

const isAssigneePopupOpen = ref(false)
const isOpenProjectPopup = ref(false)
const isOpenStatusPopup = ref(false)
const isOpenPriorityPopup = ref(false)
const isSubmitting = ref(false)

const { openPopup: openPopupAnimation, closePopup: closePopupAnimation } =
  usePopupAnimation(popupRef, () => {
    emit('close')
  })

const selectedPriority = computed(() => form.priority)
const selectedStatus = computed(() => form.status)
const selectedAssignee = computed(() =>
  props.users.find(u => u.id === form.leadId)
)
const selectedComponent = computed(() =>
  props.components.find(c => c.id === form.componentId)
)

const priorityIcon = computed(() => {
  const map: Record<string, any> = {
    'No priority': resolveComponent('IconsIconNoPriority'),
    Low: resolveComponent('IconsIconLow'),
    Medium: resolveComponent('IconsIconMedium'),
    High: resolveComponent('IconsIconHigh'),
    Urgent: resolveComponent('IconsIconUrgent'),
  }
  return map[form.priority] || resolveComponent('IconsIconNoPriority')
})

const statusIcon = computed(() => {
  const map: Record<string, any> = {
    'Todo': resolveComponent('IconsIconTodo'),
    'In progress': resolveComponent('IconsIconTaskStatus'),
    'Technical Review': resolveComponent('IconsIconTaskStatus'),
    'Completed': resolveComponent('IconsIconTaskStatus'),
    'Backlog': resolveComponent('IconsIconBacklog'),
    'Paused': resolveComponent('IconsIconTaskStatus'),
  }
  return map[form.status] || resolveComponent('IconsIconTaskStatus')
})

const statusColor = computed(() => {
  const map: Record<string, string> = {
    'Todo': '#0ea5e9',
    'In progress': '#facc15',
    'Technical Review': '#22c55e',
    'Completed': '#8b5cf6',
    'Backlog': '#f97316',
    'Paused': '#e11d48',
  }
  return map[form.status] || '#0ea5e9'
})

const getStatusTranslationKey = computed(() => {
  const map: Record<string, string> = {
    'Todo': 'status.todo',
    'In progress': 'status.inProgress',
    'Technical Review': 'status.technicalReview',
    'Completed': 'status.completed',
    'Backlog': 'status.backlog',
    'Paused': 'status.paused',
  }
  return map[form.status] || 'status.todo'
})

const handleSubmit = async () => {
  if (!form.title.trim()) return

  isSubmitting.value = true
  try {
    await tasksStore.addTask({
      ...form,
      leadId: form.leadId,
      component_id: form.componentId,
      target_date: form.targetDate || new Date().toISOString(),
    })

    // Close modal after successful submission
    closePopupAnimation()
  } catch (error) {
    console.error('Failed to create task:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handlePrioritySelect = (priority: string) => {
  form.priority = priority
  isOpenPriorityPopup.value = false
}

const handleStatusSelect = (status: string) => {
  form.status = status
  isOpenStatusPopup.value = false
}

const handleAssigneeSelect = (userId: string) => {
  form.leadId = userId
  isAssigneePopupOpen.value = false
}

const handleComponentSelect = (componentId: string) => {
  form.componentId = componentId
  isOpenProjectPopup.value = false
}

onMounted(() => {
  openPopupAnimation()
})
</script>

<template>
  <div
    class="fixed inset-0 w-full h-screen flex items-center justify-center bg-black/80 z-[9999]"
    @click="closePopupAnimation"
  >
    <div
      ref="popupRef"
      class="container mx-auto bg-primary rounded-lg border border-bordercolor shadow-lg p-6 max-w-[40rem] w-full relative"
      @click.stop
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
        @click="closePopupAnimation"
      >
        <UIcon name="uil:times" size="24" />
      </button>

      <h1 class="text-2xl font-bold mb-4 text-white">{{ t('tasks.addNewTask') }}</h1>

      <form class="space-y-4 flex flex-col" @submit.prevent="handleSubmit">
        <UFormGroup :label="t('tasks.title')" class="w-full">
          <UInput
            v-model="form.title"
            class="u-input border border-bordercolor"
            :placeholder="t('tasks.taskTitle')"
            size="xl"
            variant="none"
            required
          />
        </UFormGroup>

        <UFormGroup :label="t('tasks.description')">
          <UTextarea
            v-model="form.description"
            class="u-input border border-bordercolor"
            :placeholder="t('tasks.taskDescription')"
            size="xl"
            variant="none"
          />
        </UFormGroup>

        <UFormGroup :label="t('tasks.actions')" class="flex flex-wrap gap-2">
          <!-- Status -->
          <UPopover v-model:open="isOpenStatusPopup" :trigger-element="statusTrigger">
            <UButton
              ref="statusTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="isOpenStatusPopup = true"
            >
              <component
                :is="statusIcon"
                :stroke-color="statusColor"
                transform-status="rotate(-90 7 7)"
              />
              <span class="text-[15px] font-medium">{{ t(getStatusTranslationKey) }}</span>
            </UButton>
            <template #content>
              <TaskStatusSelectCreate
                :model-value="form.status"
                @select="handleStatusSelect"
              />
            </template>
          </UPopover>

          <!-- Priority -->
          <UPopover v-model:open="isOpenPriorityPopup" :trigger-element="priorityTrigger">
            <UButton
              ref="priorityTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="isOpenPriorityPopup = true"
            >
              <component :is="priorityIcon" />
              <span class="text-[15px] font-medium">{{ selectedPriority }}</span>
            </UButton>
            <template #content>
              <TaskPrioritySelectCreate
                :model-value="form.priority"
                @select="handlePrioritySelect"
              />
            </template>
          </UPopover>

          <!-- Component/Project -->
          <UPopover v-model:open="isOpenProjectPopup" :trigger-element="projectTrigger">
            <UButton
              ref="projectTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="isOpenProjectPopup = true"
            >
              <UIcon name="uil:folder" class="text-lg" />
              <span class="text-[15px] font-medium">
                {{ selectedComponent?.name || t('tasks.project') }}
              </span>
            </UButton>
            <template #content>
              <TaskComponentSelect
                :model-value="form.componentId"
                :components="components"
                @select="handleComponentSelect"
              />
            </template>
          </UPopover>

          <!-- Assignee -->
          <UPopover v-model:open="isAssigneePopupOpen" :trigger-element="assigneeTrigger">
            <UButton
              ref="assigneeTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="isAssigneePopupOpen = true"
            >
              <UAvatar v-if="selectedAssignee" :src="selectedAssignee.avatarUrl" size="2xs" />
              <UIcon v-else name="uil:user" class="text-lg" />
              <span class="text-[15px] font-medium">
                {{ selectedAssignee ? `${selectedAssignee.name} ${selectedAssignee.lastName}` : t('tasks.unassigned') }}
              </span>
            </UButton>
            <template #content>
              <TaskAssigneeSelectCreate
                :model-value="form.leadId"
                :users="users"
                @select="handleAssigneeSelect"
              />
            </template>
          </UPopover>
        </UFormGroup>

        <div class="flex justify-end gap-2">
          <UButton
            type="button"
            variant="ghost"
            class="border border-bordercolor text-white cursor-pointer"
            @click="closePopupAnimation"
          >
            {{ t('tasks.cancel') }}
          </UButton>
          <UButton
            type="submit"
            color="secondary"
            :loading="isSubmitting"
            :disabled="!form.title.trim() || isSubmitting"
            class="border border-bordercolor text-black cursor-pointer bg-white"
          >
            {{ isSubmitting ? t('common.loading') : t('tasks.addTask') }}
          </UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.u-input input, textarea, .u-input select) {
  color: #fff !important;
}
</style>