<!-- HeaderArea.vue -->
 <script setup lang="ts">
interface Props {
  pageTitle?: string
}

withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
})
import type { DropdownMenuItem } from '@nuxt/ui'

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Benjamin',
      avatar: {
        src: 'https://github.com/benjamincanac.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user'
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card'
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
      kbds: [',']
    },
    {
      label: 'Keyboard shortcuts',
      icon: 'i-lucide-monitor'
    }
  ],
  [
    {
      label: 'Team',
      icon: 'i-lucide-users'
    },
    {
      label: 'Invite users',
      icon: 'i-lucide-user-plus',
      children: [
        [
          {
            label: 'Email',
            icon: 'i-lucide-mail'
          },
          {
            label: 'Message',
            icon: 'i-lucide-message-square'
          }
        ],
        [
          {
            label: 'More',
            icon: 'i-lucide-circle-plus'
          }
        ]
      ]
    },
    {
      label: 'New team',
      icon: 'i-lucide-plus',
      kbds: ['meta', 'n']
    }
  ],
  [
    {
      label: 'GitHub',
      icon: 'i-simple-icons-github',
      to: 'https://github.com/nuxt/ui',
      target: '_blank'
    },
    {
      label: 'Support',
      icon: 'i-lucide-life-buoy',
      to: '/docs/components/dropdown-menu'
    },
    {
      label: 'API',
      icon: 'i-lucide-cloud',
      disabled: true
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q']
    }
  ]
])
// Vous pouvez ajouter d'autres logiques spécifiques au header ici
</script>
<template>
  <div
    class="flex items-center justify-between p-4 bg-primary border-b border-bordercolor"
  >
    <!-- Section gauche avec toggle sidebar -->
    <div class="flex items-center gap-4">
      <!-- Bouton toggle sidebar (visible uniquement sur desktop) -->
      <slot name="sidebar-toggle" />

      <!-- Titre ou breadcrumb -->
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold text-white">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <!-- Section centrale (optionnelle) -->
    <div class="hidden md:flex items-center gap-4">
      <slot name="center-content" />
    </div>

    <!-- Section droite -->
    <div class="flex items-center gap-3">
      <!-- Recherche (optionnelle) -->
      <div class="hidden lg:block">
        <UInput placeholder="Search..." class="w-64 bg-background input">
          <template #leading>
            <UIcon name="uil:search" class="w-4 h-4 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Notifications -->
      <UButton variant="ghost" class="text-white hover:bg-white/10">
        <UIcon name="uil:bell" class="w-5 h-5" />
      </UButton>

     <UDropdownMenu
      :items="items"
      :ui="{
        content: 'w-48 bg-background text-white border-none ring-bordercolor border-bordercolor rounded-md overflow-hidden',
        viewport: 'relative divide-y divide-bordercolor overflow-y-auto',
        separator: '-mx-2 my-2 h-px bg-bordercolor',
        item: 'group relative w-full flex items-center p-2 text-sm select-none text-white hover:bg-bordercolor/20',
         itemContent: 'w-full flex items-center pl-6 hover:text-white',
         itemKbd: 'ml-auto text-xs font-medium bg-bordercolor/30 rounded px-1.5 py-0.5 text-white',
         itemSubmenuIndicator: 'ml-auto text-white',
        label: 'w-full flex items-center font-semibold text-white px-2 py-1',
         itemLeadingIcon: 'shrink-0 text-white',
      }"
      color="primary"
      class="bg-bordercolor/70 text-white cursor-pointer"
    >
      <UButton icon="i-lucide-user" class="bg-bordercolor/70 text-white cursor-pointer" variant="outline" />
    </UDropdownMenu>

    </div>
  </div>
</template>

<style scoped>


</style>
