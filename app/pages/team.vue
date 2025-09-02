<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useTeamsStore } from '@/stores/team'
import { useComponentsStore } from '@/stores/components'
import { users } from '@/data/users'
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

// État simple pour le tooltip
const activeTooltip = ref<string | null>(null)

// Fonction pour obtenir le nom du composant par son ID
const getComponentName = (componentId: string) => {
  const component = components.value.find(c => c.id === componentId)
  return component?.name || componentId
}

// Gestion simple du hover
const handleAvatarHover = (teamId: string) => {
  activeTooltip.value = teamId
}

const handleAvatarLeave = (teamId: string) => {
  if (activeTooltip.value === teamId) {
    activeTooltip.value = null
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
          <div class="border-b border-bordercolor shrink-0 sticky top-0 bg-primary z-20">
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
                        <p class="text-base font-medium text-gray-900 dark:text-white truncate">
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
                      size="md"
                      class="text-white bg-bordercolor/70 flex gap-1 max-w-max items-center"
                    >
                      <UIcon name="i-heroicons-check" class="w-3 h-3" />
                      Joined
                    </UBadge>
                    <span v-else class="text-gray-400 text-sm">—</span>
                  </div>

                  <!-- Component - Caché sur mobile et tablette -->
                  <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                    <UBadge variant="outline" class="text-gray-300" size="md">
                      {{ getComponentName(team.identifier) }}
                    </UBadge>
                  </div>

                  <!-- Members - Toujours visible -->
                  <div class="col-span-12 sm:col-span-6 lg:col-span-2 xl:col-span-2 relative">
                    <div class="flex items-center gap-1 relative">
                      <!-- Groupe d'avatars avec hover pour tooltip -->
                      <div 
                        class="flex items-center -space-x-2 cursor-pointer"
                        @mouseenter="handleAvatarHover(team.identifier)"
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

                      <!-- Composant Tooltip -->
                      <TeamMembersTooltip />
                      <TeamMembersTooltip 
                        v-if="activeTooltip === team.identifier" 
                        :members="team.members" 
                        :users="users" 
                        class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-10"
                      />
                    </div>
                  </div>

                  <!-- Projects - Caché sur mobile, tablette et écrans moyens -->
                  <div class="hidden xl:block xl:col-span-2">
                    <UBadge variant="outline" class="text-gray-300" size="md">
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