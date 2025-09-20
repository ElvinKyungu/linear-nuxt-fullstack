<script setup lang="ts">
const props = defineProps<{
  taskId: string
  modelValue: string
  triggerElement?: any
}>()

const emit = defineEmits(['update:model-value', 'close'])

const filter = ref('')
const statuses = ['Todo', 'In Progress', 'Done', 'Blocked']
const filtered = computed(() =>
  statuses.filter(s => s.toLowerCase().includes(filter.value.toLowerCase()))
)

const store = useTasksStore()

const handleSelect = async (status: string) => {
  await store.updateTaskOptimized(props.taskId, { status })
  emit('update:model-value', status)
  emit('close')
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search status..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="s in filtered"
        :key="s"
        class="cursor-pointer p-1 hover:bg-white/10 rounded text-white"
        @click="handleSelect(s)"
      >
        
        {{ s }}
      </div>
    </div>
  </div>
</template>
