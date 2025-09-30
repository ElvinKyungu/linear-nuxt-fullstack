<script setup lang="ts">
import type { Priority } from '@/types/priority'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits(['select', 'close'])

const priorityMap: Priority[] = [
  { id: 0, name: 'No priority', icon: resolveComponent('IconsIconNoPriority') },
  { id: 1, name: 'Urgent', icon: resolveComponent('IconsIconUrgent') },
  { id: 2, name: 'High', icon: resolveComponent('IconsIconHigh') },
  { id: 3, name: 'Medium', icon: resolveComponent('IconsIconMedium') },
  { id: 4, name: 'Low', icon: resolveComponent('IconsIconLow') },
]

const filter = ref('')
const filtered = computed(() =>
  priorityMap.filter(p => p.name.toLowerCase().includes(filter.value.toLowerCase()))
)

const handleSelect = (priority: Priority) => {
  emit('select', priority.name)
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search priority..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="p in filtered"
        :key="p.id"
        class="cursor-pointer p-1 hover:bg-white/10 rounded"
        @click="handleSelect(p)"
      >
        <div class="flex items-center gap-1">
          <UButton variant="ghost" class="cursor-pointer text-white">
            <component :is="p.icon" />
          </UButton>
          <span class="text-white">{{ p.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>