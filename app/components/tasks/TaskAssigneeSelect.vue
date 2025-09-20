<script setup lang="ts">
import type { User } from '@/types/user'

const props = defineProps<{
  users: User[]
  taskId: string
  modelValue: string | null
  triggerElement?: any
}>

const emit = defineEmits(['update:model-value', 'close'])

const filter = ref('')
const filteredUsers = computed(() =>
  props.users.filter(u =>
    u.name.toLowerCase().includes(filter.value.toLowerCase())
  )
)

const store = useTasksStore()

const handleSelect = async (user: User) => {
  await store.updateTaskOptimized(props.taskId, { leadId: user.id })
  emit('update:model-value', user.id)
  emit('close')
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search assignee..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="cursor-pointer p-1 hover:bg-white/10 rounded flex items-center gap-2"
        @click="handleSelect(user)"
      >
        <UAvatar :src="user.avatarUrl" size="sm" />
        {{ user.name }}
      </div>
    </div>
  </div>
</template>
