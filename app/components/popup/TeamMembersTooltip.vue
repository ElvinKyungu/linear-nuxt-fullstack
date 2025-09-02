<script setup lang="ts">
import { gsap } from 'gsap'
import type { PropType } from 'vue'
import { users } from '@/data/users'
import type { Team } from '@/types/teams'

const props = defineProps({
  team: { type: Object as PropType<Team>, required: true },
  placement: { type: String as PropType<'top' | 'bottom'>, default: 'top' }
})

const el = ref<HTMLElement | null>(null)

onMounted(() => {
  gsap.from(el.value, { opacity: 0, y: 10, duration: 0.18, ease: 'power2.out' })
})

const teamUsers = computed(() => {
  return props.team.members.map(m => {
    const u = users.find(x => x.id === m.userId)
    return {
      ...m,
      name: u?.name || 'Unknown',
      avatarUrl: u?.avatarUrl,
      email: u?.email
    }
  })
})
</script>

<template>
    <div
    ref="el"
    class="z-[999] min-w-[240px] max-w-[300px] h-auto rounded-2xl border border-bordercolor/80 bg-primary p-3 shadow-lg pointer-events-auto"
  >
    <!-- Flèche -->
    <div
      v-if="placement === 'top'"
      class="absolute w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"
      style="left:50%; top:100%; transform:translateX(-50%);"
    />
    <div
      v-else
      class="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900"
      style="left:50%; bottom:100%; transform:translateX(-50%);"
    />

    <div class="text-white">
      <h3 class="mb-2 text-sm font-medium">{{ team.name }} Members</h3>

      <div class="max-h-56 space-y-2 overflow-y-auto">
        <div v-for="member in teamUsers" :key="member.userId" class="flex items-center gap-2">
          <UAvatar :src="member.avatarUrl" :alt="member.name" size="xs" class="flex-shrink-0" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm text-white">{{ member.name }}</p>
            <p v-if="member.email" class="truncate text-xs text-gray-400">{{ member.email }}</p>
          </div>
          <UBadge variant="soft" size="sm"
              class="flex justify-center items-center"
                  :class="member.role === 'Admin' ? 'bg-teal-600/60 text-white' : 'bg-bordercolor/70 text-white'">
            {{ member.role }}
          </UBadge>
        </div>
      </div>

      <div v-if="teamUsers.length === 0" class="py-2 text-center text-sm text-gray-400">
        No members found
      </div>
    </div>
  </div>
</template>
