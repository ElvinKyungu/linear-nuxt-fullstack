<script setup lang="ts">
interface Status {
  id: number
  name: 'Todo' | 'In progress' | 'Technical Review' | 'Completed' | 'Backlog' | 'Paused'
  icon: any
  color: string
}

const props = defineProps<{
  taskId: string
  modelValue: string
  triggerElement?: any
}>()

const emit = defineEmits(['update:model-value', 'close'])

const statusMap: Status[] = [
  { id: 0, name: 'Todo', icon: resolveComponent('IconsIconTodo'), color: '#0ea5e9' },
  { id: 1, name: 'In progress', icon: resolveComponent('IconsIconTaskStatus'), color: '#facc15' },
  { id: 2, name: 'Technical Review', icon: resolveComponent('IconsIconTaskStatus'), color: '#22c55e' },
  { id: 3, name: 'Completed', icon: resolveComponent('IconsIconTaskStatus'), color: '#8b5cf6' },
  { id: 4, name: 'Backlog', icon: resolveComponent('IconsIconBacklog'), color: '#f97316' },
  { id: 5, name: 'Paused', icon: resolveComponent('IconsIconTaskStatus'), color: '#e11d48' },
]
const filter = ref('')
const filtered = computed(() =>
  statusMap.filter(s => s.name.toLowerCase().includes(filter.value.toLowerCase()))
)

const store = useTasksStore()

const handleSelect = async (status: Status) => {
  await store.updateTask(props.taskId, { status: status.name })
  emit('close')
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <h2 class="font-bold text-lg">Select Status</h2>
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search status..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="s in filtered"
        :key="s.id"
        class="cursor-pointer p-1 hover:bg-white/10 rounded"
        @click="handleSelect(s)"
      >
        <div class="flex items-center gap-1">
          <UButton variant="ghost" class="cursor-pointer text-white">
            <component :is="s.icon" :stroke-color="s.color" transform-status="rotate(-90 7 7)" />
          </UButton>
          <span class="text-white">{{ s.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
