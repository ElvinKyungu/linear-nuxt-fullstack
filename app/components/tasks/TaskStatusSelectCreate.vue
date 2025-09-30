<script setup lang="ts">
interface Status {
  id: number
  nameKey: string
  originalName: 'Todo' | 'In progress' | 'Technical Review' | 'Completed' | 'Backlog' | 'Paused'
  icon: any
  color: string
}

defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['select'])
const { t } = useI18n()

const statusMap: Status[] = [
  { id: 0, nameKey: 'status.todo', originalName: 'Todo', icon: resolveComponent('IconsIconTodo'), color: '#0ea5e9' },
  { id: 1, nameKey: 'status.inProgress', originalName: 'In progress', icon: resolveComponent('IconsIconTaskStatus'), color: '#facc15' },
  { id: 2, nameKey: 'status.technicalReview', originalName: 'Technical Review', icon: resolveComponent('IconsIconTaskStatus'), color: '#22c55e' },
  { id: 3, nameKey: 'status.completed', originalName: 'Completed', icon: resolveComponent('IconsIconTaskStatus'), color: '#8b5cf6' },
  { id: 4, nameKey: 'status.backlog', originalName: 'Backlog', icon: resolveComponent('IconsIconBacklog'), color: '#f97316' },
  { id: 5, nameKey: 'status.paused', originalName: 'Paused', icon: resolveComponent('IconsIconTaskStatus'), color: '#e11d48' },
]

const filter = ref('')
const filtered = computed(() =>
  statusMap.filter(s => t(s.nameKey).toLowerCase().includes(filter.value.toLowerCase()))
)

const handleSelect = (status: Status) => {
  emit('select', status.originalName)
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <h2 class="font-bold text-lg">{{ t('status.selectStatus') }}</h2>
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" :placeholder="t('status.searchStatus')" size="sm" />
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
          <span class="text-white">{{ t(s.nameKey) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>