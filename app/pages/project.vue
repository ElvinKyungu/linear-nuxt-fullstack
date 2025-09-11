<script setup lang="ts">
import { UAvatar } from '#components'
import { users } from '@/data/users'
import { statusConfig } from '@/data/projects'
import type { Team } from '@/types/teams'

const projectsStore = useProjectStore()
const componentsStore = useComponentsStore()
const { projects, loading } = storeToRefs(projectsStore)
const { components } = storeToRefs(componentsStore)

const popup = ref<HTMLElement | null>(null)
const search = ref('')
const userSearch = ref('')
const isOpen = ref(false)

const priorityMap = [
  { id: 0, name: 'No priority', icon: resolveComponent('IconsIconNoPriority') },
  { id: 1, name: 'Urgent', icon: resolveComponent('IconsIconUrgent') },
  { id: 2, name: 'High', icon: resolveComponent('IconsIconHigh') },
  { id: 3, name: 'Medium', icon: resolveComponent('IconsIconMedium') },
  { id: 4, name: 'Low', icon: resolveComponent('IconsIconLow') },
]

const filteredPriorities = computed(() =>
  priorityMap.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredUsers = computed(() =>
  users.filter((u) =>
    `${u.name} ${u.lastName}`.toLowerCase().includes(userSearch.value.toLowerCase())
  )
)

const selectPriority = (level: any) => {
  // Logique pour mettre à jour la priority
  console.log('Selected priority:', level)
  // Vous pouvez utiliser projectsStore.updatePriority ici
}

const selectUser = (user: any, projectId: string) => {
  projectsStore.updateLead(projectId, user.id)
}

const selectStatus = (status: any, projectId: string) => {
  projectsStore.updateStatus(projectId, status.id)
}

const updateDate = (date: Date, projectId: string) => {
  const formattedDate = date.toISOString().split('T')[0]
  projectsStore.updateProject(projectId, { startDate: formattedDate })
}

const getHealthIcon = (health: any) => {
  return health?.icon || 'i-heroicons-question-mark-circle'
}

const getStatusConfig = (status: string) => {
  return statusConfig.find(s => s.id === status) || statusConfig[0]
}

onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    componentsStore.fetchComponents(),
  ])
})

const getComponentName = (componentId: string) => {
  const component = components.value.find(c => c.id === componentId)
  return component?.name || componentId
}

</script>

<template>
  <NuxtLayout>
    <div class="h-full flex flex-col overflow-hidden">
      <UCard class="bg-primary flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 flex flex-col overflow-hidden">
          <HeaderProjectTable />

          <div class="flex-1 overflow-y-auto">
            <div class="min-w-full divide-y divide-bordercolor/20">
              <div
                v-for="project in projects"
                :key="project.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200 border-b border-bordercolor/10"
              >
                <div class="grid grid-cols-12 gap-4 px-6 py-4 items-center w-full">
                  <!-- Title Column -->
                  <div
                    class="col-span-6 flex justify-start w-full items-end sm:col-span-6 lg:col-span-3 xl:col-span-6"
                  >
                    <div class="flex items-center gap-3 text-gray-300 font-medium text-lg">
                      <IconsIconComponent/>
                      <span>{{ project.title }}</span>
                    </div>
                  </div>

                  <!-- Health Column -->
                  <div
                    class="hidden md:block md:col-span-3 lg:col-span-1 xl:col-span-1"
                  >
                    <UPopover v-if="project.health">
                      <UBadge
                        variant="soft"
                        size="md"
                        class="text-white hover:bg-bordercolor/70 flex p-2 gap-2 max-w-max items-center cursor-pointer"
                        :style="{ backgroundColor: project.health.color + '20', borderColor: project.health.color }"
                      >
                        <UIcon
                          :name="getHealthIcon(project.health)" 
                          :style="{ color: project.health.color }" 
                          class="text-xl" />
                        <span>{{ project.health.title }}</span>
                      </UBadge>
                      <template #content>
                        <div class="items-center gap-2 bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 z-[999] min-w-64 top-10 inline-flex">
                          <div>
                            <div class="space-y-1 overflow-y-auto">
                              <div class="flex justify-between items-center gap-3">
                                <h4>{{ project.title }}</h4>
                                <div class="flex justify-between gap-2 items-center">
                                  <UButton label="Subscribe" class="text-white border-[1px] rounded-2xl border-bordercolor hover:bg-bordercolor/70"/>
                                  <UButton label="Notification" icon="uil:bell" class="text-white rounded-2xl border-[1px] border-bordercolor hover:bg-bordercolor/70"/>
                                </div>
                              </div>
                              <USeparator />
                              <div class="flex items-center gap-2 text-gray-400">
                                <UIcon
                                  :name="getHealthIcon(project.health)" 
                                  :style="{ color: project.health.color }" 
                                  class="text-xl"
                                />
                                <span class="text-gray-200">
                                  {{ project.health?.id}}
                                </span>
                                <UAvatar
                                  :src="
                                    users.find((u) => u.id === project.lead)?.avatarUrl
                                  "
                                  :alt="users.find((u) => u.id === project.lead)?.name"
                                  size="xs"
                                  class="ring-2 ring-black "
                                />
                                <span class="">
                                  {{ 
                                  users.find((u) => u.id === project.lead)?.name.toLowerCase()
                                  }}.{{
                                  users.find((u) => u.id === project.lead)?.lastName.toLowerCase() 
                                  }}
                                </span>
                                <span>{{ project.startDate }}</span>
                              </div>
                              <span class="flex items-center gap-2 text-gray-400">{{ project.health.description}}</span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>
                    <div v-else class="text-gray-500 text-sm">No health</div>
                  </div>

                  <!-- Priority Column -->
                  <div
                    class="hidden md:block md:col-span-3 lg:col-span-1 xl:col-span-1"
                  >
                    <UPopover>
                      <UBadge
                        variant="soft"
                        size="md"
                        class="text-white hover:bg-bordercolor/70 flex p-2 gap-1 max-w-max items-center cursor-pointer"
                      >
                        <IconsIconNoPriority />
                      </UBadge>
                      <template #content>
                        <div class="items-center gap-2 bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 z-[999] max-w-64 top-10 inline-flex">
                          <div
                            ref="popup"
                            class=""
                          >
                            <div class="flex flex-col gap-2 mb-3 w-full">
                              <h2 class="text-sm font-medium">Priority Level</h2>
                              <UInput
                                v-model="search"
                                trailing-icon="uil:search"
                                placeholder="Search priority..."
                                size="md"
                                class="text-sm"
                              />
                            </div>

                            <div class="space-y-1 max-h-64 overflow-y-auto">
                              <button
                                v-for="item in filteredPriorities"
                                :key="item.id"
                                class="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                                @click="selectPriority(item)"
                              >
                                <div class="flex items-center gap-3">
                                  <UButton variant="ghost" class="cursor-pointer text-white">
                                    <component :is="item.icon" />
                                  </UButton>
                                  <span>{{ item.name }}</span>
                                </div>
                                <div class="flex items-center gap-1">
                                  <span class="text-xs text-gray-500">{{ item.id }}</span>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Lead Column -->
                  <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                     <UPopover>
                      <div class="flex gap-2 items-center cursor-pointer hover:bg-gray-800/50 rounded p-1">
                        <UAvatar
                        :src="
                          users.find((u) => u.id === project.lead)?.avatarUrl
                        "
                        :alt="users.find((u) => u.id === project.lead)?.name"
                        size="xs"
                        class="ring-2 ring-black"
                      />
                        <span class="text-gray-300 text-sm">
                          {{ users.find((u) => u.id === project.lead)?.name.toLowerCase() }}.
                          {{ users.find((u) => u.id === project.lead)?.lastName.toLowerCase() }}
                        </span>
                      </div>
                      <template #content>
                        <div class="items-center gap-2 bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 z-[999] max-w-64 top-10 inline-flex">
                          <div
                            ref="popup"
                            class=""
                          >
                            <div class="flex flex-col gap-2 mb-3 w-full">
                              <h2 class="text-sm font-medium">Assign Lead</h2>
                              <UInput
                                v-model="userSearch"
                                trailing-icon="uil:search"
                                placeholder="Search users..."
                                size="md"
                                class="text-sm"
                              />
                            </div>

                            <div class="space-y-1 max-h-64 overflow-y-auto">
                              <button
                                v-for="user in filteredUsers"
                                :key="user.id"
                                class="w-full flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                                @click="selectUser(user, project.id)"
                              >
                                <div class="flex items-center gap-3">
                                  <UAvatar
                                    :src="user.avatarUrl"
                                    :alt="user.name"
                                    size="xs"
                                    class="ring-2 ring-black"
                                  />
                                  <div class="flex flex-col items-start">
                                    <span class="text-white">
                                      {{ user.name }} {{ user.lastName }}
                                    </span>
                                    <span class="text-xs text-gray-400">{{ user.email }}</span>
                                  </div>
                                </div>
                                <UIcon 
                                  v-if="project.lead === user.id"
                                  name="i-heroicons-check"
                                  class="text-green-500"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Date Column -->
                  <div
                    class="col-span-6 text-gray-300 text-sm flex sm:col-span-6 lg:col-span-2 xl:col-span-1 relative"
                  >
                    <UPopover>
                      <div class="cursor-pointer hover:bg-gray-800/50 rounded p-1">
                        {{ formatDate(project.startDate) }}
                      </div>
                      <template #content>
                        <div class="bg-primary border border-bordercolor rounded-lg shadow-lg p-3">
                          <UCalendar size="xl" />
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Status/Percent Column -->
                  <div class="hidden xl:block lg:flex justify-start xl:col-span-1">
                    <UPopover>
                      <div class="cursor-pointer hover:bg-gray-800/50 rounded p-1">
                        <UBadge 
                          variant="outline" 
                          class="text-gray-300 flex items-center gap-2" 
                          size="md"
                          :style="{ borderColor: getStatusConfig(project.status).color }"
                        >
                          <UIcon 
                            :name="getStatusConfig(project?.status)?.icon || 'i-heroicons-question-mark-circle'" 
                            :style="{ color: getStatusConfig(project?.status)?.color }"
                            class="text-xl"
                          />
                          <span>{{ project.percentComplete }}%</span>
                        </UBadge>
                      </div>
                      <template #content>
                        <div class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 z-[999] min-w-48">
                          <div class="flex flex-col gap-2 mb-3">
                            <h3 class="text-sm font-medium">Change Status</h3>
                          </div>
                          <div class="space-y-1">
                            <button
                              v-for="status in statusConfig"
                              :key="status.id"
                              class="w-full flex items-center justify-between px-2 py-2 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                              @click="selectStatus(status, project.id)"
                            >
                              <div class="flex items-center gap-3">
                                <UIcon 
                                  :name="status.icon" 
                                  :style="{ color: status.color }"
                                />
                                <span>{{ status.name }}</span>
                              </div>
                              <UIcon 
                                v-if="project.status === status.id"
                                name="i-heroicons-check"
                                class="text-green-500"
                              />
                            </button>
                          </div>
                        </div>
                      </template>
                    </UPopover>
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
            v-else-if="projects.length === 0"
            class="flex justify-center items-center py-8"
          >
            <div class="text-center">
              <UIcon
                name="i-heroicons-users"
                class="w-12 h-12 text-gray-300 mx-auto mb-2"
              />
              <p class="text-gray-500">Aucun projet trouvée</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<style scoped>

</style>