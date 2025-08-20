<script setup lang="ts">
import { useSidebarStore } from '@/stores/sidebar'

const target = ref(null)
const sidebarStore = useSidebarStore()

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false
})

const menuGroups = ref([
  {
    label: 'Home',
    isOpen: true,
    items: [{ label: 'Dashboard', icon: 'uil:home', to: '/' }],
  },
  {
    label: 'Pages',
    icon: 'uil:briefcase',
    isOpen: true,
    items: [
      { label: 'Landing', icon: 'uil:globe', to: '/' },
      {
        label: 'Auth',
        icon: 'uil:user',
        isOpen: false,
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

const toggleGroup = (group: any) => {
  group.isOpen = !group.isOpen
}
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
          <li v-for="(group, i) in menuGroups" :key="i" class="mb-2">
            <button
              class="w-full flex items-center justify-between py-2 px-3 font-semibold uppercase text-gray-300 hover:text-white"
              @click="toggleGroup(group)"
            >
              <span>{{ group.label }}</span>
              <UIcon
                name="uil:angle-down"
                class="w-8 h-8 transition-transform duration-200"
                :class="{ 'rotate-180': group.isOpen }"
              />
            </button>
            <ul v-if="group.isOpen" class="pl-4">
              <li
                v-for="(item, j) in group.items"
                :key="j"
                class="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded px-3"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
                <NuxtLink :to="item.to" class="flex-1">{{
                  item.label
                }}</NuxtLink>
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

/* petite animation */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}
.slide-enter-to,
.slide-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>
