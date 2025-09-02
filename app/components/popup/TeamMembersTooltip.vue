<!-- components/TeamMembersTooltip.vue -->
<script setup lang="ts">
import { users } from '@/data/users'
import type { Team } from '@/types/teams'

interface Props {
  team: Team
  show: boolean
}

const props = defineProps<Props>()

const tooltipRef = ref<HTMLElement>()
const position = ref<'top' | 'bottom'>('top')

const { showModal, hideModal } = useGsapModal()

onMounted(() => {
  console.log(props.team);

  // Calculer la position automatiquement
  const calculatePosition = () => {
    if (!tooltipRef.value) return

    const rect = tooltipRef.value.getBoundingClientRect()
  const spaceAbove = rect.top
  const spaceBelow = window.innerHeight - rect.bottom
  
  // Si pas assez d'espace en haut (280px pour le tooltip), on met en bas
  position.value = spaceAbove > 280 ? 'top' : 'bottom'
})

// Watcher pour les changements de visibilité
watch(() => props.show, (newShow) => {
  if (!tooltipRef.value) return
  if (newShow) {
    calculatePosition()
    nextTick(() => {
      if (tooltipRef.value) {
        showModal(tooltipRef.value)
      }
    })
  } else {
    hideModal(tooltipRef.value)
  }
})
</script>

<template>
  <UCard
    v-show="show"
    ref="tooltipRef"
    :class="[
      'absolute w-72 z-50 shadow-xl opacity-0',
      position === 'top' 
        ? 'bottom-full left-0 mb-1' 
        : 'top-full left-0 mt-1'
    ]"
    :ui="{ 
      base: 'overflow-visible',
      body: { padding: 'p-3' }
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h4 class="text-sm font-semibold">Team Members</h4>
        <UBadge variant="soft" size="xs">{{ team.members.length }}</UBadge>
      </div>
    </template>

    <div class="space-y-2 max-h-48 overflow-y-auto">
      <div 
        v-for="member in team.members" 
        :key="member.userId"
        class="flex items-center gap-3"
      >
        <UAvatar
          :src="users.find(u => u.id === member.userId)?.avatarUrl"
          :alt="users.find(u => u.id === member.userId)?.name"
          size="sm"
        />
        <div class="flex-1 min-w-0">
          <p class="text-base font-medium text-gray-900 dark:text-white truncate">
            {{ users.find(u => u.id === member.userId)?.name }}
          </p>
          <p class="text-xs text-gray-500 truncate">
            {{ users.find(u => u.id === member.userId)?.email }}
          </p>
        </div>
        <UBadge variant="soft">
          {{ member.role }}
        </UBadge>
      </div>
    </div>
  </UCard>
</template>