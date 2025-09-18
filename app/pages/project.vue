<script setup lang="ts">
import { users } from '@/data/users'
import { statusConfig } from '@/data/projects'
import { priorityLevels } from '@/data/priority'

const projectsStore = useProjectStore()
const componentsStore = useComponentsStore()
const { projects, loading } = storeToRefs(projectsStore)

const search = ref('')
const userSearch = ref('')

const priorityIcons = {
  IconHigh: resolveComponent('IconHigh'),
  IconMedium: resolveComponent('IconMedium'),
  IconLow: resolveComponent('IconLow'),
  IconNoPriority: resolveComponent('IconNoPriority'),
  IconUrgent: resolveComponent('IconUrgent'),
}
const filteredPriorities = computed(() =>
  priorityLevels.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

const filteredUsers = computed(() =>
  users.filter((u) =>
    `${u.name} ${u.lastName}`
      .toLowerCase()
      .includes(userSearch.value.toLowerCase())
  )
)

// Refs pour contrôler l'ouverture des popovers
const priorityPopovers = ref({})
const userPopovers = ref({})
const datePopovers = ref({})
const statusPopovers = ref({})

const selectPriority = (level: any, projectId: string) => {
  projectsStore.updatePriority(projectId, level.id)
  priorityPopovers.value[projectId] = false
}

const selectUser = (user: any, projectId: string) => {
  projectsStore.updateLead(projectId, user.id)
  userPopovers.value[projectId] = false
}

const selectStatus = (status: any, projectId: string) => {
  projectsStore.updateStatus(projectId, status.id)
  statusPopovers.value[projectId] = false
}

const getHealthIcon = (health: any) => {
  return health?.icon || 'i-heroicons-question-mark-circle'
}

const getStatusConfig = (status: string) => {
  return statusConfig.find((s) => s.id === status) || statusConfig[0]
}

const getPriorityConfig = (priority: number) => {
  return priorityLevels.find((p) => p.id === priority) || priorityLevels[0]
}
const getPriorityIcon = (priority: number) => {
  const config = getPriorityConfig(priority)
  return priorityIcons[config?.icon] || priorityIcons.IconNoPriority
}
onMounted(async () => {
  await Promise.all([
    projectsStore.fetchProjects(),
    componentsStore.fetchComponents(),
  ])
})
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
                <div
                  class="grid grid-cols-12 gap-4 px-6 py-4 items-center w-full"
                >
                  <!-- Title Column -->
                  <div
                    class="col-span-6 flex justify-start w-full items-end sm:col-span-6 lg:col-span-3 xl:col-span-6"
                  >
                    <div
                      class="flex items-center gap-3 text-gray-300 font-medium text-lg"
                    >
                      <IconComponent />
                      <span class="lg:text-base text-sm">{{ project.title }}</span>
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
                        :style="{
                          backgroundColor: project.health.color + '20',
                          borderColor: project.health.color,
                        }"
                      >
                        <UIcon
                          :name="getHealthIcon(project.health)"
                          :style="{ color: project.health.color }"
                          class="text-lg"
                        />
                        <span class="lg:text-base text-sm">{{ project.health.title }}</span>
                      </UBadge>
                      <template #content>
                        <div
                          class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 min-w-64"
                        >
                          <div class="space-y-3">
                            <div
                              class="flex justify-between items-center gap-3"
                            >
                              <h4 class="text-sm font-medium">
                                {{ project.title }}
                              </h4>
                              <div class="flex gap-2">
                                <UButton
                                  size="xs"
                                  label="Subscribe"
                                  class="text-white border border-bordercolor hover:bg-bordercolor/70"
                                />
                                <UButton
                                  size="xs"
                                  icon="i-heroicons-bell"
                                  class="text-white border border-bordercolor hover:bg-bordercolor/70"
                                />
                              </div>
                            </div>
                            <USeparator />
                            <div
                              class="flex items-center gap-2 text-gray-400 text-sm"
                            >
                              <UIcon
                                :name="getHealthIcon(project.health)"
                                :style="{ color: project.health.color }"
                              />
                              <span class="text-gray-200">{{
                                project.health?.title
                              }}</span>
                              <UAvatar
                                :src="
                                  users.find((u) => u.id === project.lead)
                                    ?.avatarUrl
                                "
                                :alt="
                                  users.find((u) => u.id === project.lead)?.name
                                "
                                size="xs"
                                class="ring-2 ring-black"
                              />
                              <span>
                                {{
                                  users
                                    .find((u) => u.id === project.lead)
                                    ?.name?.toLowerCase()
                                }}.{{
                                  users
                                    .find((u) => u.id === project.lead)
                                    ?.lastName?.toLowerCase()
                                }}
                              </span>
                              <span>{{ project.startDate }}</span>
                            </div>
                            <p class="text-gray-400 text-sm">
                              {{ project.health.description }}
                            </p>
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
                    <UPopover v-model:open="priorityPopovers[project.id]">
                      <UBadge
                        variant="soft"
                        size="md"
                        class="text-white hover:bg-bordercolor/70 flex p-2 gap-1 max-w-max items-center cursor-pointer"
                      >
                        <component
                          :is="getPriorityIcon(project.priority)"
                          class="text-lg"
                        />
                      </UBadge>
                      <template #content>
                        <div
                          class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64"
                        >
                          <div class="flex flex-col gap-2 mb-3">
                            <h2 class="text-sm font-medium">Priority Level</h2>
                            <UInput
                              v-model="search"
                              icon="i-heroicons-magnifying-glass"
                              placeholder="Search priority..."
                              size="sm"
                            />
                          </div>
                          <div class="space-y-1 max-h-64 overflow-y-auto">
                            <div
                              v-for="item in filteredPriorities"
                              :key="item.id"
                              class="flex items-center justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                              @click="selectPriority(item, project.id)"
                            >
                              <div class="flex items-center gap-3">
                                <component
                                  :is="priorityIcons[item.icon]"
                                  class="text-lg"
                                />
                                <span>{{ item.name }}</span>
                              </div>
                              <UIcon
                                v-if="project.priority === item.id"
                                name="i-heroicons-check"
                                class="text-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Lead Column -->
                  <div 
                    class="col-span-6 flex items-center lg:justify-start justify-end 
                    sm:col-span-6 
                    md:col-span-2 lg:col-span-2 xl:col-span-2"
                  >
                    <UPopover v-model:open="userPopovers[project.id]">
                      <div
                        class="flex gap-2 items-center cursor-pointer hover:bg-gray-800/50 rounded p-1"
                      >
                        <UAvatar
                          :src="
                            users.find((u) => u.id === project.lead)?.avatarUrl
                          "
                          :alt="users.find((u) => u.id === project.lead)?.name"
                          size="xs"
                          class="ring-2 ring-black"
                        />
                        <span class="text-gray-300 fontt-medium">
                          {{
                            users
                              .find((u) => u.id === project.lead)
                              ?.name?.toLowerCase()
                          }}.{{
                            users
                              .find((u) => u.id === project.lead)
                              ?.lastName?.toLowerCase()
                          }}
                        </span>
                      </div>
                      <template #content>
                        <div
                          class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64"
                        >
                          <div class="flex flex-col gap-2 mb-3">
                            <h2 class="text-sm font-medium">Assign Lead</h2>
                            <UInput
                              v-model="userSearch"
                              icon="i-heroicons-magnifying-glass"
                              placeholder="Search users..."
                              size="sm"
                            />
                          </div>
                          <div class="space-y-1 max-h-64 overflow-y-auto">
                            <div
                              v-for="user in filteredUsers"
                              :key="user.id"
                              class="flex items-center gap-4 justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
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
                                  <span class="text-white"
                                    >{{ user.name }} {{ user.lastName }}</span
                                  >
                                  <span class="text-xs text-gray-400">{{
                                    user.email
                                  }}</span>
                                </div>
                              </div>
                              <UIcon
                                v-if="project.lead === user.id"
                                name="i-heroicons-check"
                                class="text-green-500"
                              />
                            </div>
                          </div>
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Date Column -->
                  <div
                    class="hidden col-span-6 text-gray-300 text-sm md:flex sm:col-span-6 lg:col-span-2 xl:col-span-1 relative"
                  >
                    <UPopover v-model:open="datePopovers[project.id]">
                      <div
                        class="cursor-pointer hover:bg-gray-800/50 rounded p-1"
                      >
                        {{ formatDate(project.startDate) }}
                      </div>
                      <template #content>
                        <div
                          class="bg-primary border border-bordercolor rounded-lg shadow-lg p-3"
                        >
                          <UCalendar />
                        </div>
                      </template>
                    </UPopover>
                  </div>

                  <!-- Status/Percent Column -->
                  <div
                    class="hidden xl:block lg:flex justify-start xl:col-span-1"
                  >
                    <UPopover v-model:open="statusPopovers[project.id]">
                      <div
                        class="cursor-pointer hover:bg-gray-800/50 rounded p-1"
                      >
                        <UBadge
                          variant="outline"
                          class="text-gray-300 flex items-center gap-2"
                          size="md"
                          :style="{
                            borderColor: getStatusConfig(project.status)?.color,
                          }"
                        >
                          <UIcon
                            :name="
                              getStatusConfig(project?.status)?.icon ||
                              'i-heroicons-question-mark-circle'
                            "
                            :style="{
                              color: getStatusConfig(project?.status)?.color,
                            }"
                            class="text-lg"
                          />
                          <span>{{ project.percentComplete }}%</span>
                        </UBadge>
                      </div>
                      <template #content>
                        <div
                          class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 min-w-48"
                        >
                          <div class="flex flex-col gap-2 mb-3">
                            <h3 class="text-sm font-medium">Change Status</h3>
                          </div>
                          <div class="space-y-1">
                            <div
                              v-for="status in statusConfig"
                              :key="status.id"
                              class="flex items-center gap-3 justify-between px-2 py-2 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                              @click="selectStatus(status, project.id)"
                            >
                              <div class="flex items-center gap-3">
                                <UIcon
                                  :name="status.icon"
                                  :style="{ color: status.color }"
                                  class="text-lg"
                                />
                                <span>{{ status.name }}</span>
                              </div>
                              <UIcon
                                v-if="project.status === status.id"
                                name="i-heroicons-check"
                                class="text-green-500"
                              />
                            </div>
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
              <p class="text-gray-500">Aucun projet trouvé</p>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
