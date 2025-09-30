<script setup lang="ts">
import type { User } from '@/types/user'

const props = defineProps<{
  users: User[]
  modelValue: string | null
}>()

const emit = defineEmits(['select', 'close'])

const filter = ref('')
const filteredUsers = computed(() =>
  props.users.filter(u =>
    `${u.name} ${u.lastName}`.toLowerCase().includes(filter.value.toLowerCase())
  )
)

const handleSelect = (user: User) => {
  emit('select', user.id)
}
</script>

<template>
  <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64">
    <h2 class="font-bold text-lg mb-2">Select Assignee</h2>
    <UInput v-model="filter" icon="i-heroicons-magnifying-glass" placeholder="Search assignee..." size="sm" />
    <div class="space-y-1 max-h-64 overflow-y-auto mt-2">
      <div
        v-for="user in filteredUsers"
        :key="user.id"
        class="cursor-pointer p-1 hover:bg-white/10 rounded flex items-center gap-2"
        @click="handleSelect(user)"
      >
        <UAvatar :src="user.avatarUrl" size="sm" />
        <span>{{ user.name }} {{ user.lastName }}</span>
        <UIcon
          v-if="user.id === modelValue"
          name="i-heroicons-check"
          class="text-green-400 ml-auto"
        />
      </div>
    </div>
  </div>
</template>