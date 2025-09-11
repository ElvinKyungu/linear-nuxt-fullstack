<script setup lang="ts">
import { UAvatar } from '#components'
import { users } from '@/data/users'
import type { Team } from '@/types/teams'

const projectsStore = useProjectStore()
const componentsStore = useComponentsStore()
const { projects, loading } = storeToRefs(projectsStore)
const { components } = storeToRefs(componentsStore)

const popup = ref<HTMLElement | null>(null)
const search = ref('')
const isOpen = ref(false)

const priorityMap = [
  { id: 0, name: 'No priority', icon: resolveComponent('IconsIconNoPriority') },
  { id: 1, name: 'Urgent', icon: resolveComponent('IconsIconUrgent') },
  { id: 2, name: 'High', icon: resolveComponent('IconsIconHigh') },
  { id: 3, name: 'Medium', icon: resolveComponent('IconsIconMedium') },
  { id: 4, name: 'Low', icon: resolveComponent('IconsIconLow') },
]

const filtered = computed(() =>
  priorityMap.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
)
const selectLevel = (level: any) => {
  gsap.to(popup.value, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      emit('update:modelValue', level)
      emit('close')
    },
  })
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
                  <div
                    class="col-span-6 flex justify-start w-full items-end sm:col-span-6 lg:col-span-3 xl:col-span-6"
                  >
                    <div class="flex items-center gap-3 text-gray-300 font-medium text-lg">
                      <IconsIconComponent/>
                      <span>{{ project.title }}</span>
                    </div>
                  </div>

                  <div
                    class="hidden md:block md:col-span-3 lg:col-span-1 xl:col-span-1"
                  >
                    <UPopover>
                      <UBadge
                        variant="soft"
                        size="md"
                        class="text-white hover:bg-bordercolor/70 flex p-2 gap-2 max-w-max items-center"
                      >
                        <IconsIconNoPriority />
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
                  </div>
                  <div
                    class="hidden md:block md:col-span-3 lg:col-span-1 xl:col-span-1"
                  >
                    <UPopover>
                      <UBadge
                        variant="soft"
                        size="md"
                        class="text-white hover:bg-bordercolor/70 flex p-2 gap-1 max-w-max items-center"
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
                              <h2 class="text-sm font-medium">Task Level</h2>
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
                                v-for="item in filtered"
                                :key="item.id"
                                class="w-full flex items-center justify-between px-2 py-1rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                                @click="selectLevel(item)"
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

                  <div class="hidden lg:block lg:col-span-2 xl:col-span-2">
                     <UPopover>
                      <div class="flex gap-2 items-center">
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
                              <h2 class="text-sm font-medium">Task Level</h2>
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
                                v-for="item in filtered"
                                :key="item.id"
                                class="w-full flex items-center justify-between px-2 py-1rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                                @click="selectLevel(item)"
                              >
                                <div class="flex items-center gap-3">
                                  <UAvatar
                                    :src="
                                      users?.avatarUrl
                                    "
                                    :alt="users.find((u) => u.id === project.lead)?.name"
                                    size="xs"
                                    class="ring-2 ring-black"
                                  />
                                  <span>
                                    {{ 
                                      users.find((u) => u.id === project.lead)?.name.toLowerCase()
                                    }}.{{ 
                                      users.find((u) => u.id === project.lead)?.lastName.toLowerCase()
                                    }}
                                  </span>
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

                  <div
                    class="col-span-6 text-gray-300 text-sm flex sm:col-span-6 lg:col-span-2 xl:col-span-1 relative"
                  >
                    {{ formatDate(project.startDate) }}
                  </div>
                  <div class="hidden xl:block lg:flex justify-start xl:col-span-1">
                    <UBadge variant="outline" class="text-gray-300" size="md">
                      percent
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