<script setup lang="ts">
import { gsap } from 'gsap'
import type { User } from '@/types/users'

const usersStore = useUsersStore()

const props = defineProps({
  modelValue: {
    type: String as PropType<string | null>,
    default: null,
  },
  triggerElement: {
    type: Object as PropType<{ $el: HTMLElement }>,
    default: null,
  },
  users: {
    type: Array as PropType<User[]>,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const popup = ref<HTMLElement | null>(null)
const search = ref('')
const selected = ref<User | null>(null)

onMounted(async () => {
  if (usersStore.users.length === 0) {
    await usersStore.fetchUsers()
  }
  selected.value = usersStore.users.find((u) => u.id === props.modelValue) || null
  gsap.from(popup.value, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.out',
  })
})

onClickOutside(popup, () => emit('close'))

const filteredUsers = computed(() =>
  props.users.filter((u: User) => u.name.toLowerCase().includes(search.value.toLowerCase()))
)

const selectUser = (user: User) => {
  selected.value = user
  gsap.to(popup.value, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      emit('update:modelValue', user.id)
      emit('close')
    },
  })
}
</script>

<template>
  <div
    ref="popup"
    class="absolute items-center gap-2 bg-primary border border-b border-bordercolor rounded-lg shadow-lg p-3 z-[999] w-64 top-10 text-white"
  >
    <div class="flex flex-col gap-2 mb-3">
      <h2 class="text-sm text-left font-medium">Assign to...</h2>
      <UInput
        v-model="search"
        trailing-icon="uil:search"
        placeholder="Search users..."
        size="md"
        class="flex-1 w-full"
      />
    </div>

    <div class="space-y-1 max-h-64 overflow-y-auto">
      <div v-if="usersStore.loading" class="text-gray-500 text-center py-2">Loading users...</div>
      <button
        v-for="user in filteredUsers"
        v-else
        :key="user.id"
        class="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-100 cursor-pointer text-sm transition"
        @click="selectUser(user)"
      >
        <div class="flex items-center gap-3">
          <UChip inset>
            <UAvatar
              ref="assigneeTrigger"
              :src="user.avatarUrl"
              :alt="user.name || 'default'"
              size="sm"
              class="cursor-pointer hover:ring-2 hover:ring-primary"
            />
          </UChip>
          <span>{{ user.name }} {{ user.last_name }}</span>
        </div>
        <UIcon v-if="selected?.id === user.id" name="uil:check" class="text-green-500" />
      </button>
    </div>
  </div>
</template>
