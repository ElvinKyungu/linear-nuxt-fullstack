<script setup lang="ts">
import type { Task } from '@/types/tasks'
import type { User } from '@/types/user'
import type { Components } from '@/types/components'

const props = defineProps<{
  task: Task
  users: User[]
  components: Components[]
  displayMode: string
  statusColor: string
}>()
const tasksStore = useTasksStore()
const componentsStore = useComponentsStore()

const popupRef = ref<HTMLElement | null>(null)
const priorityTrigger = ref<HTMLElement | null>(null)
const assigneeTrigger = ref<HTMLElement | null>(null)
const statusTrigger = ref<HTMLElement | null>(null)
const ProjectTriggerElement = ref<HTMLElement | null>(null)
const form = reactive({
  title: '',
  description: '',
  status: 'Todo',
  type: 'Feature',
  priority: 'No priority',
  lead_id: null,
  progress: 0,
  target_date: '',
})
const { openPopup: openPopupAnimation, closePopup: closePopupAnimation } = usePopupAnimation(
  popupRef,
  () => {
    emit('close')
  }
)

const emit = defineEmits(['close'])

const isAssigneePopupOpen = ref(false)
const isOpenProjectPopup = ref(false)
const isOpenStatusPopup = ref(false)
const isOpenPriorityPopup = ref(false)

const handleSubmit = async () => {
  await tasksStore.addTask(form)
}

const openStatusPopup = () => {
  isOpenStatusPopup.value = true
}
const openAssigneePopup = () => {
  isAssigneePopupOpen.value = true
}

const openProjectPopup = () => {
  isOpenProjectPopup.value = true
}
const openPriorityPopup = () => {
  isOpenPriorityPopup.value = true
}
onMounted(() => {
  openPopupAnimation()
})
</script>
<template>
  <div
    class="fixed inset-0 w-full h-screen flex items-center justify-center bg-black z-[9999]"
    @click="closePopupAnimation"
  >
    <div
      ref="popupRef"
      class="container mx-auto bg-primary rounded-lg border border-bordercolor shadow-lg p-6 max-w-[40rem] w-full relative"
      @click.stop
    >
      <button
        class="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        @click="closePopupAnimation"
      >
        <UIcon name="uil:times" size="24" />
      </button>
      <h1 class="text-2xl font-bold mb-4 text-white">Add New Task</h1>

      <form class="space-y-4 flex flex-col" @submit.prevent="handleSubmit">
        <UFormGroup label="Title" class="w-full">
          <UInput
            v-model="form.title"
            class="u-input border border-bordercolor"
            placeholder="Task title"
            size="xl"
            variant="none"
            required
          />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea
            v-model="form.description"
            class="u-input border border-bordercolor"
            placeholder="Task description"
            size="xl"
            variant="none"
          />
        </UFormGroup>
        <UFormGroup label="actions" class="flex flex-wrap gap-2">
          <div class="flex relative">
            <UButton
              ref="statusTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="openStatusPopup"
            >
              <IconTaskStatus />
              <span class="text-[15px] font-medium">In progress</span>
            </UButton>
            <TaskStatusSelector
              v-if="isOpenStatusPopup"
              :trigger-element="statusTrigger"
              @close="isOpenStatusPopup = false"
            />
          </div>
          <div class="flex relative">
            <UButton
              ref="priorityTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="openPriorityPopup"
            >
              <IconNoPriority />
              <span class="text-[15px] font-medium">No priority</span>
            </UButton>
            <TaskPrioritySelector
              v-if="isOpenPriorityPopup"
              :trigger-element="priorityTrigger"
              @close="isOpenPriorityPopup = false"
            />
          </div>
          <div class="flex relative">
            <UButton
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="openProjectPopup"
            >
              <UIcon name="uil:folder" class="text-lg" />
              <span class="text-[15px] font-medium">Project</span>
            </UButton>
            <TaskProjectSelector
              v-if="isOpenProjectPopup"
              :component="componentsStore.components"
              :trigger-element="ProjectTriggerElement"
              @close="isOpenProjectPopup = false"
            />
          </div>
          <div class="flex relative">
            <UButton
              ref="assigneeTrigger"
              class="bg-black text-white border border-bordercolor rounded-full px-3 py-1"
              @click="openAssigneePopup"
            >
              <UIcon name="uil:user" class="text-lg" />
              <span class="text-[15px] font-medium">Unassigned</span>
            </UButton>
            <TaskAssignSelect
              v-if="isAssigneePopupOpen"
              :users="props.users"
              :trigger-element="assigneeTrigger ? { $el: assigneeTrigger } : undefined"
              @close="isAssigneePopupOpen = false"
            />
          </div>
        </UFormGroup>
        <div class="flex justify-end">
          <UButton type="submit" color="secondary">Add Task</UButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
:deep(.u-input input, .u-input textarea, .u-input select) {
  color: #fff !important;
}
</style>
