<script setup lang="ts">
import gsap from 'gsap'

const sidebarRef = ref(null)
const sidebarStore = useSidebarStore()

onClickOutside(sidebarRef, () => {
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
    isOpen: false,
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

// refs dynamiques pour chaque sous-menu
const submenuRefs = ref<Record<string, HTMLElement | null>>({})

const setSubmenuRef = (el: HTMLElement | null, key: string) => {
  if (el) submenuRefs.value[key] = el
}

// toggle + animation gsap
const toggleGroup = (group: any, key: string) => {
  group.isOpen = !group.isOpen

  if (group.isOpen) {
    nextTick(() => {
      const el = submenuRefs.value[key]
      if (el) {
        gsap.from(el.children, {
          opacity: 0,
          y: -10,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
        })
      }
    })
  }
}
</script>

<template>
  <aside
    ref="sidebarRef"
    class="absolute left-0 top-0 z-sidebar flex h-screen w-80 flex-col overflow-y-hidden bg-primary text-white duration-300 ease-in-out lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen,
    }"
  >
    <!-- Header -->
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

    <!-- Menu -->
    <div class="flex flex-col px-5 overflow-y-auto">
      <nav>
        <ul>
          <li v-for="(group, i) in menuGroups" :key="i" class="mb-2">
            <button
              class="w-full flex items-center justify-between py-2 px-3 font-semibold uppercase text-gray-300 hover:text-white"
              @click="toggleGroup(group, group.label)"
            >
              <span>{{ group.label }}</span>
              <UIcon
                name="uil:angle-down"
                class="w-8 h-8 transition-transform duration-200"
                :class="{ 'rotate-180': group.isOpen }"
              />
            </button>

            <!-- sous-menu -->
            <ul
              v-if="group.isOpen"
              :ref="(el) => setSubmenuRef(el, group.label)"
              class="pl-4"
            >
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
