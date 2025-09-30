<script setup lang="ts">
import type { Components } from '@/types/components'

const props = defineProps<{
  components: Components[]
  modelValue: string | null
}>()

const emit = defineEmits(['select', 'close'])

const filter = ref('')
const filteredComponents = computed(() =>
  props.components.filter(c =>
    c.name.toLowerCase().includes(filter.value.toLowerCase())
  )
)

const handleSelect = (component: Components) => {
  emit('select', component.id)
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <h2 class="font-bold text-lg mb-2">Select Component</h2>
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search component..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="component in filteredComponents"
        :key="component.id"
        class="cursor-pointer p-1 hover:bg-white/10 rounded flex items-center gap-2"
        @click="handleSelect(component)"
      >
        <UIcon name="uil:folder" class="text-lg text-gray-400" />
        <span>{{ component.name }}</span>
        <UIcon
          v-if="component.id === modelValue"
          name="i-heroicons-check"
          class="text-green-400 ml-auto"
        />
      </div>
    </div>
  </div>
</template>