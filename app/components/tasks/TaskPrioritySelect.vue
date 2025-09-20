<script setup lang="ts">
const props = defineProps<{
  taskId: string
  modelValue: string
  triggerElement?: any
}>

const emit = defineEmits(['update:model-value', 'close'])

const filter = ref('')
const priorities = ['No priority', 'Low', 'Medium', 'High', 'Urgent']
const filtered = computed(() =>
  priorities.filter(p => p.toLowerCase().includes(filter.value.toLowerCase()))
)

const store = useTasksStore()

const handleSelect = async (priority: string) => {
  await store.updateTaskOptimized(props.taskId, { priority })
  emit('update:model-value', priority)
  emit('close')
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search priority..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="p in filtered"
        :key="p"
        class="cursor-pointer p-1 hover:bg-white/10 rounded"
        @click="handleSelect(p)"
      >
        {{ p }}
      </div>
    </div>
  </div>
</template>
