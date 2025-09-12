<script setup lang="ts">
import { users } from '@/data/users'
import type { Team } from '@/types/teams'

const teamsStore = useTeamsStore()
const componentsStore = useComponentsStore()
const { teams, loading } = storeToRefs(teamsStore)
const { components } = storeToRefs(componentsStore)

onMounted(async () => {
  await Promise.all([
    teamsStore.fetchTeams(),
    componentsStore.fetchComponents(),
  ])
})

const getDisplayedMembers = (team: Team) => team.members.slice(0, 4)
const getRemainingCount = (team: Team) => Math.max(team.members.length - 4, 0)

const getComponentName = (componentId: string) => {
  const component = components.value.find((c) => c.id === componentId)
  return component?.name || componentId
}

/** --- Tooltip global state --- */
const activeTeamId = ref<string | null>(null)
const activeTeam = computed(
  () => teams.value.find((t) => t.identifier === activeTeamId.value) || null
)

const anchorRect = reactive({ x: 0, y: 0, w: 0, h: 0 })
const placement = ref<'top' | 'bottom'>('top')

let hideTimer: number | undefined

function openTooltip(teamId: string, el: HTMLElement) {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
  activeTeamId.value = teamId
  const r = el.getBoundingClientRect()
  anchorRect.x = r.left + r.width / 2
  anchorRect.y = r.top
  anchorRect.w = r.width
  anchorRect.h = r.height
  // 280px ≈ hauteur max du tooltip
  placement.value = r.top > 280 ? 'top' : 'bottom'
}

function scheduleClose() {
  hideTimer = window.setTimeout(() => {
    activeTeamId.value = null
  }, 120)
}
function cancelClose() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = undefined
  }
}

const tooltipStyle = computed(() => {
  if (!activeTeam.value) return {}
  if (placement.value === 'top') {
    return {
      position: 'fixed',
      left: `${anchorRect.x}px`,
      top: `${anchorRect.y - 8}px`,
      transform: 'translate(-50%, -100%)',
    }
  }
  return {
    position: 'fixed',
    left: `${anchorRect.x}px`,
    top: `${anchorRect.y + anchorRect.h + 8}px`,
    transform: 'translate(-50%, 0)',
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="h-full flex flex-col overflow-hidden">
      <!-- Table Container - prend toute la hauteur disponible -->
      <UCard class="bg-primary flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          <!-- Header fixe -->
          <div
            class="border-b border-bordercolor shrink-0 sticky top-0 bg-primary z-20"
          >
            <div class="min-w-full">
              <div class="grid grid-cols-12 gap-4 px-6 py-3">
                <!-- Responsive columns -->
                <div
                  class="col-span-6 flex justify-start w-full items-start sm:col-span-6 lg:col-span-4 xl:col-span-4"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </span>
                </div>
                <div
                  class="hidden md:block md:col-span-3 lg:col-span-2 xl:col-span-2"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Membership
                  </span>
                </div>
                <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Component
                  </span>
                </div>
                <div
                  class="flex justify-end w-full items-end col-span-6 sm:col-span-6 lg:col-span-2 xl:col-span-2"
                >
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    Members
                  </span>
                </div>
                <div class="hidden xl:block xl:col-span-2">
                  <span
                    class="text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
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
                <div
                  class="grid grid-cols-12 gap-4 px-6 py-4 items-center w-full"
                >
                  <!-- Name - Toujours visible -->
                  <div
                    class="col-span-6 flex justify-start w-full items-end sm:col-span-6 lg:col-span-4 xl:col-span-4"
                  >
                    <div class="flex items-center gap-3">
                      <UAvatar
                        :alt="team.name"
                        size="sm"
                        class="flex-shrink-0"
                      />
                      <div class="min-w-0 flex-1">
                        <p
                          class="text-base font-medium text-gray-900 dark:text-white truncate"
                        >
                          {{ team.name }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    class="hidden md:block md:col-span-3 lg:col-span-2 xl:col-span-2"
                  >
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

                  <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                    <UBadge variant="outline" class="text-gray-300" size="md">
                      {{ getComponentName(team.identifier) }}
                    </UBadge>
                  </div>

                  <div
                    class="col-span-6 flex justify-end w-full items-end sm:col-span-6 lg:col-span-2 xl:col-span-2 relative"
                  >
                    <div class="flex items-center gap-1 relative">
                      <div
                        :ref="`teamMemberTrigger-${team.identifier}`"
                        class="flex items-center -space-x-2 cursor-pointer"
                        @mouseenter="
                          (e) =>
                            openTooltip(
                              team.identifier,
                              e.currentTarget as HTMLElement
                            )
                        "
                        @mouseleave="scheduleClose"
                      >
                        <UAvatar
                          v-for="member in getDisplayedMembers(team)"
                          :key="member.userId"
                          :src="
                            users.find((u) => u.id === member.userId)?.avatarUrl
                          "
                          :alt="users.find((u) => u.id === member.userId)?.name"
                          size="xs"
                          class="ring-2 ring-black"
                        />
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
                    </div>
                  </div>
                  <div class="hidden xl:block xl:col-span-2">
                    <UBadge variant="outline" class="text-gray-300" size="md">
                      {{ team.projects }}
                      {{ team.projects === 1 ? 'project' : 'projects' }}
                    </UBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="loading" class="flex justify-center items-center py-8">
            <UIcon
              name="i-heroicons-arrow-path"
              class="animate-spin w-6 h-6 text-gray-400"
            />
            <span class="ml-2 text-gray-500">Chargement...</span>
          </div>
          <div
            v-else-if="teams.length === 0"
            class="flex justify-center items-center py-8"
          >
            <div class="text-center">
              <UIcon
                name="i-heroicons-users"
                class="w-12 h-12 text-gray-300 mx-auto mb-2"
              />
              <p class="text-gray-500">Aucune équipe trouvée</p>
            </div>
          </div>
        </div>
      </UCard>
      <Teleport to="body">
        <TeamMembersTooltip
          v-if="activeTeam"
          :team="activeTeam"
          :placement="placement"
          :style="tooltipStyle"
          @mouseenter.native="cancelClose"
          @mouseleave.native="scheduleClose"
        />
      </Teleport>
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
