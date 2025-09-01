<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useTeamsStore } from '@/stores/team'
import { useComponentsStore } from '@/stores/components'
import { users } from '@/data/users'
import { gsap } from 'gsap'
import type { Team } from '@/types/teams'

const teamsStore = useTeamsStore()
const componentsStore = useComponentsStore()
const { teams, loading } = storeToRefs(teamsStore)
const { components } = storeToRefs(componentsStore)

onMounted(async () => {
  await Promise.all([
    teamsStore.fetchTeams(),
    componentsStore.fetchComponents()
  ])
})

const getDisplayedMembers = (team: Team) => team.members.slice(0, 4)
const getRemainingCount = (team: Team) => team.members.length - 4

// Refs pour gérer les tooltips
const activeTooltip = ref<string | null>(null)
const tooltipPositions = ref<Record<string, 'top' | 'bottom'>>({})
const isAnimating = ref<Record<string, boolean>>({})

// Fonction pour obtenir le nom du composant par son ID
const getComponentName = (componentId: string) => {
  const component = components.value.find(c => c.id === componentId)
  return component?.name || componentId
}

// Gestion du hover sur les avatars
const handleAvatarHover = async (teamId: string, event: MouseEvent) => {
  // Éviter les tooltips multiples
  if (isAnimating.value[teamId] || activeTooltip.value === teamId) return
  
  const target = event.currentTarget as HTMLElement
  
  // Calculer la position du tooltip
  const rect = target.getBoundingClientRect()
  const spaceAbove = rect.top
  const spaceBelow = window.innerHeight - rect.bottom
  
  // Par défaut en haut, mais en bas si pas assez de place
  tooltipPositions.value[teamId] = (spaceAbove > 200) ? 'top' : 'bottom'
  
  // Marquer comme en cours d'animation
  isAnimating.value[teamId] = true
  
  // Activer le tooltip
  activeTooltip.value = teamId
  
  // Attendre le rendu puis animer
  await nextTick()
  
  const tooltipElement = document.querySelector(`[data-tooltip="${teamId}"]`)
  if (tooltipElement) {
    gsap.fromTo(tooltipElement, 
      { 
        opacity: 0, 
        scale: 0.8,
        y: tooltipPositions.value[teamId] === 'top' ? 10 : -10
      },
      { 
        opacity: 1, 
        scale: 1,
        y: 0,
        duration: 0.2,
        ease: "back.out(1.7)",
        onComplete: () => {
          isAnimating.value[teamId] = false
        }
      }
    )
  } else {
    isAnimating.value[teamId] = false
  }
}

// Gestion de la sortie du hover
const handleAvatarLeave = (teamId: string) => {
  // Éviter l'animation si déjà en cours
  if (isAnimating.value[teamId]) return
  
  const tooltipElement = document.querySelector(`[data-tooltip="${teamId}"]`)
  
  if (tooltipElement) {
    isAnimating.value[teamId] = true
    gsap.to(tooltipElement, {
      opacity: 0,
      scale: 0.8,
      y: tooltipPositions.value[teamId] === 'top' ? 10 : -10,
      duration: 0.15,
      ease: "power2.in",
      onComplete: () => {
        activeTooltip.value = null
        isAnimating.value[teamId] = false
      }
    })
  } else {
    activeTooltip.value = null
    isAnimating.value[teamId] = false
  }
}
</script>

<template>
  <NuxtLayout>
    <div class="h-full flex flex-col overflow-hidden">
      <!-- Table Container - prend toute la hauteur disponible -->
      <UCard class="bg-primary flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Header fixe -->
          <div class="border-b border-bordercolor shrink-0">
            <div class="min-w-full">
              <div class="grid grid-cols-12 gap-4 px-6 py-3">
                <!-- Responsive columns -->
                <div class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-4">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </span>
                </div>
                <div class="hidden md:block md:col-span-3 lg:col-span-2 xl:col-span-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Membership
                  </span>
                </div>
                <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Component
                  </span>
                </div>
                <div class="col-span-12 sm:col-span-6 lg:col-span-2 xl:col-span-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Members
                  </span>
                </div>
                <div class="hidden xl:block xl:col-span-2">
                  <span class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Projects
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Table Body scrollable - prend le reste de l'espace -->
          <div class="flex-1 overflow-y-auto">
            <div class="min-w-full divide-y divide-bordercolor/20">
              <div 
                v-for="team in teams" 
                :key="team.identifier" 
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border-b border-bordercolor/10"
              >
                <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <!-- Name - Toujours visible -->
                  <div class="col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-4">
                    <div class="flex items-center gap-3">
                      <UAvatar 
                        :alt="team.name"
                        size="sm"
                        class="flex-shrink-0"
                      />
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {{ team.name }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Membership - Caché sur mobile -->
                  <div class="hidden md:block md:col-span-3 lg:col-span-2 xl:col-span-2">
                    <UBadge 
                      v-if="team.membership" 
                      variant="soft"
                      size="sm"
                      class="text-white bg-bordercolor/70"
                    >
                      Joined
                    </UBadge>
                    <span v-else class="text-gray-400 text-sm">—</span>
                  </div>

                  <!-- Component - Caché sur mobile et tablette -->
                  <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                    <UBadge variant="undefined" class="text-gray-300" size="sm">
                      {{ getComponentName(team.identifier) }}
                    </UBadge>
                  </div>

                  <!-- Members - Toujours visible -->
                  <div class="col-span-12 sm:col-span-6 lg:col-span-2 xl:col-span-2 relative">
                    <div class="flex items-center gap-1 relative">
                      <!-- Groupe d'avatars avec hover pour tooltip -->
                      <div 
                        class="flex items-center -space-x-2 cursor-pointer"
                        @mouseenter="handleAvatarHover(team.identifier, $event)"
                        @mouseleave="handleAvatarLeave(team.identifier)"
                      >
                        <!-- Affichage des 4 premiers avatars -->
                        <UAvatar
                          v-for="member in getDisplayedMembers(team)" 
                          :key="member.userId"
                          :src="users.find(u => u.id === member.userId)?.avatarUrl"
                          :alt="users.find(u => u.id === member.userId)?.name"
                          size="xs"
                          class="ring-2 ring-black"
                        />

                        <!-- Cercle +X si plus de 4 membres -->
                        <UAvatar
                          v-if="team.members.length > 4"
                          :alt="`+${getRemainingCount(team)} more`"
                          size="xs"
                          class="bg-black text-white ring-2 ring-black"
                        >
                          <span class="text-xs font-bold">
                            +{{ getRemainingCount(team) }}
                          </span>
                        </UAvatar>
                      </div>

                      <!-- Tooltip dynamique avec Nuxt UI -->
                      <UCard
                        v-if="activeTooltip === team.identifier"
                        :data-tooltip="team.identifier"
                        :class="[
                          'absolute left-0 w-72 z-50 shadow-xl',
                          tooltipPositions[team.identifier] === 'top' 
                            ? 'bottom-full mb-2' 
                            : 'top-full mt-2'
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
                              <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {{ users.find(u => u.id === member.userId)?.name }}
                              </p>
                              <p class="text-xs text-gray-500 truncate">
                                {{ users.find(u => u.id === member.userId)?.email }}
                              </p>
                            </div>
                            <UBadge variant="soft" size="xs">
                              {{ member.role }}
                            </UBadge>
                          </div>
                        </div>
                      </UCard>
                    </div>
                  </div>

                  <!-- Projects - Caché sur mobile, tablette et écrans moyens -->
                  <div class="hidden xl:block xl:col-span-2">
                    <UBadge variant="undefined" class="text-gray-300" size="sm">
                      {{ team.projects }} {{ team.projects === 1 ? 'project' : 'projects' }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-8">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin w-6 h-6 text-gray-400" />
            <span class="ml-2 text-gray-500">Chargement...</span>
          </div>

          <!-- Empty State -->
          <div v-else-if="teams.length === 0" class="flex justify-center items-center py-8">
            <div class="text-center">
              <UIcon name="i-heroicons-users" class="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p class="text-gray-500">Aucune équipe trouvée</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<style scoped>
/* Styles personnalisés pour les animations */
.tooltip-enter-active,
.tooltip-leave-active {
  transition: all 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
</style>