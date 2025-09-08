<!-- components/SidebarArea.vue -->
<script setup lang="ts">
import gsap from 'gsap'

const sidebarRef = ref(null)
const sidebarStore = useSidebarStore()

// Fermer la sidebar quand on clique à l'extérieur (sur mobile)
onClickOutside(sidebarRef, () => {
  if (sidebarStore.isMobileOrTablet) {
    sidebarStore.closeSidebar()
  }
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
      { label: 'Team', icon: 'uil:user', to: '/team' },
      { label: 'Not Found', icon: 'uil:exclamation-circle', to: '/' },
      { label: 'Table', icon: 'uil:table', to: '/' },
      { label: 'Images', icon: 'uil:image', to: '/' },
      { label: 'File', icon: 'uil:file-alt', to: '/' },
    ],
  },
  {
    label: 'Auth',
    icon: 'uil:user',
    isOpen: true,
    items: [
      { label: 'Login', icon: 'uil:sign-in-alt', to: '/' },
      { label: 'Profile', icon: 'uil:user', to: '/' },
      { label: 'Access Denied', icon: 'uil:lock', to: '/' },
      { label: 'List', icon: 'uil:list-ul', to: '/' },
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

// Fermer la sidebar (pour le bouton X sur mobile)
const closeSidebar = () => {
  sidebarStore.closeSidebar()
}
</script>

<template>
  <aside
    ref="sidebarRef"
    class="absolute left-0 top-0 z-sidebar flex h-screen w-80 flex-col overflow-y-hidden bg-primary text-white duration-300 ease-in-out lg:static lg:translate-x-0"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen || sidebarStore.isDesktop,
      '-translate-x-full': !sidebarStore.isSidebarOpen && sidebarStore.isMobileOrTablet,
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
      
      <!-- Bouton de fermeture pour mobile/tablet -->
      <UButton
        icon="uil:times"
        variant="ghost"
        class="lg:hidden hover:bg-white/10"
        @click="closeSidebar"
      />
    </div>

    <!-- Menu -->
    <div class="flex flex-col px-5 overflow-y-auto flex-1">
      <nav class="flex-1">
        <ul>
          <li v-for="(group, i) in menuGroups" :key="i" class="mb-2">
            <button
              class="w-full flex items-center justify-between py-2 px-3 font-semibold uppercase text-gray-300 hover:text-white transition-colors"
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
                class="py-2 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded px-3 transition-colors"
              >
                <UIcon :name="item.icon" class="w-5 h-5" />
                <NuxtLink 
                  :to="item.to" 
                  class="flex-1 hover:text-white transition-colors"
                  @click="sidebarStore.isMobileOrTablet && closeSidebar()"
                >
                  {{ item.label }}
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>

      <!-- Section promotionnelle -->
      <div
        class="group/sidebar relative flex flex-col gap-2 rounded-lg border border-bordercolor p-4 text-sm w-full mt-4"
      >
        <div class="absolute top-2.5 right-2 z-10 cursor-pointer" role="button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x size-4 hover:text-gray-300 transition-colors"
          >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
          </svg>
        </div>
        <div
          class="text-balance text-lg font-semibold leading-tight group-hover/sidebar:underline"
        >
          Open-source layouts by Elvin Code
        </div>
        <div class="text-gray-300">
          Collection of beautifully crafted open-source layouts UI built with
          NuxtUI.
        </div>
        <a target="_blank" rel="noreferrer" class="absolute inset-0" href="">
          <span class="sr-only">Square by Elvin Code</span>
        </a>
        <button
          class="inline-flex items-center bg-white justify-center whitespace-nowrap text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-black shadow-xs hover:bg-gray-100 h-8 rounded-md gap-1.5 px-3 w-full mt-2"
        >
          <a target="_blank" rel="noopener noreferrer" href="">elvincode.com</a>
        </button>
      </div>

      <!-- Boutons du bas -->
      <div
        class="w-full flex items-center justify-between mt-4 gap-2"
      >
        <UButton
          class="text-gray-400 bg-gray-400/20 hover:text-white hover:bg-gray-400/30 flex-1"
          variant="ghost"
        >
          <UIcon
            name="uil:question-circle"
            class="text-xl cursor-pointer text-gray-400"
          />
        </UButton>
        <UButton
          class="text-gray-400 bg-gray-400/20 hover:text-white hover:bg-gray-400/30 flex-1"
          variant="ghost"
        >
          <UIcon
            name="uil:github"
            class="text-xl cursor-pointer text-gray-400"
          />
        </UButton>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.z-sidebar {
  z-index: 99;
}

/* Améliorations visuelles */
.transition-colors {
  transition: color 0.2s ease-in-out;
}

/* Scrollbar personnalisée */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.5);
}
</style>