<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'

const target = ref(null)
const sidebarStore = useSidebarStore()

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false
})

const themeIcon = computed(() => {
  switch (theme.value) {
    case 'light':
      return 'uil:sun'
    case 'dark':
      return 'uil:moon'
    case 'ghibli':
      return 'uil:film'
    default:
      return 'uil:desktop'
  }
})

function setTheme(value: 'light' | 'dark' | 'system' | 'ghibli') {
  theme.value = value
  isThemeModalOpen.value = false
  // ici tu peux aussi persister ce choix dans localStorage ou useColorMode
}

const menuGroups = ref([
  {
    label: 'Home',
    items: [{ label: 'Dashboard', icon: 'uil:home', to: '/' }],
  },
  {
    label: 'Pages',
    icon: 'uil:briefcase',
    to: '/pages',
    items: [
      { label: 'Landing', icon: 'uil:globe', to: '/' },
      {
        label: 'Auth',
        icon: 'uil:user',
        items: [
          { label: 'Login', icon: 'uil:sign-in-alt', to: '/' },
          { label: 'Profile', icon: 'uil:user', to: '/' },
          { label: 'Access Denied', icon: 'uil:lock', to: '/' },
          { label: 'List', icon: 'uil:list-ul', to: '/' },
        ],
      },
      { label: 'Crud', icon: 'uil:edit', to: '/' },
      { label: 'Not Found', icon: 'uil:exclamation-circle', to: '/' },
      { label: 'Table', icon: 'uil:table', to: '/' },
      { label: 'Images', icon: 'uil:image', to: '/' },
      { label: 'File', icon: 'uil:file-alt', to: '/' },
    ],
  },
])
</script>

<template>
  <aside
    ref="target"
    class="absolute left-0 top-0 z-sidebar flex h-screen w-80 flex-col overflow-y-hidden bg-primary text-white border-r border-bordercolor duration-300 ease-in-out lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen,
    }"
  >
    <div class="flex items-center justify-between px-5 py-5">
      <NuxtLink to="/" class="flex items-center gap-2 text-white text-lg">
        <NuxtImg
          src="https://nuxt.com/assets/design-kit/icon-green.svg"
          alt="Logo"
          width="40"
          height="40"
          class="h-10"
        />
        <span class="mt-1">Project Hub</span>
      </NuxtLink>
      <UButton
        icon="uil:times"
        variant="ghost"
        class="lg:hidden"
        @click="sidebarStore.isSidebarOpen = false"
      />
    </div>

    <div class="flex flex-col px-5 overflow-y-auto">
      <nav>
        <ul>
          <li v-for="(group, i) in menuGroups" :key="i" class="mb-4">
            <p class="text-sm font-semibold uppercase text-gray-400">
              {{ group.label }}
            </p>
            <ul>
              <li
                v-for="(item, j) in group.items"
                :key="j"
                class="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded px-3"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
                <NuxtLink :to="item.to" class="flex-1">{{ item.label }}</NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
</template>

<style>
.z-sidebar {
  z-index: 99;
}
</style>
