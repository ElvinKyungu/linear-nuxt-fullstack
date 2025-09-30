<!-- HeaderArea.vue -->
 <script setup lang="ts">
interface Props {
  pageTitle?: string
}

withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
})
import type { DropdownMenuItem } from '@nuxt/ui'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const { t } = useI18n()

const isProfileModalOpen = ref(false)

const handleItemClick = async (item: DropdownMenuItem) => {
  if (item.label === t('header.profile')) {
    isProfileModalOpen.value = true
  } else if (item.label === t('header.logout')) {
    await authStore.logout()
  }
}

const items = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: user.value ? `${user.value.name} ${user.value.lastName}` : 'Utilisateur',
      avatar: {
        src: user.value?.avatarUrl || '/default-avatar.png'
      },
      type: 'label'
    }
  ],
  [
    {
      label: t('header.profile'),
      icon: 'i-lucide-user',
      click: () => handleItemClick({ label: t('header.profile') })
    }
  ],
  [
    {
      label: t('header.team'),
      icon: 'i-lucide-users'
    },
    {
      label: t('header.inviteUsers'),
      icon: 'i-lucide-user-plus',
      children: [
        [
          {
            label: t('header.email'),
            icon: 'i-lucide-mail'
          },
          {
            label: t('header.message'),
            icon: 'i-lucide-message-square'
          }
        ],
        [
          {
            label: t('header.more'),
            icon: 'i-lucide-circle-plus'
          }
        ]
      ]
    },
    {
      label: t('header.newTeam'),
      icon: 'i-lucide-plus',
      kbds: ['meta', 'n']
    }
  ],
   [
    {
      label: t('header.github'),
      icon: 'i-simple-icons-github',
      to: 'https://github.com/elvinKyungu/linear-nuxt-fullstack',
      target: '_blank'
    },
    {
      label: t('header.api'),
      icon: 'i-lucide-cloud',
      disabled: true
    }
  ],
  [
    {
      label: t('header.logout'),
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q'],
      click: () => handleItemClick({ label: t('header.logout') })
    }
  ],
])
</script>
<template>
  <div
    class="flex items-center justify-between p-4 bg-primary border-b border-bordercolor"
  >
    <!-- Left section with sidebar toggle -->
    <div class="flex items-center gap-4">
      <!-- Sidebar toggle button (visible only on desktop) -->
      <slot name="sidebar-toggle" />

      <!-- Title or breadcrumb -->
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold text-white">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <!-- Center section (optional) -->
    <div class="hidden md:flex items-center gap-4">
      <slot name="center-content" />
    </div>

    <!-- Right section -->
    <div class="flex items-center gap-3">
      <!-- Search (optional) -->
      <div class="hidden lg:block">
        <UInput :placeholder="t('common.search')" class="w-64 bg-background input">
          <template #leading>
            <UIcon name="uil:search" class="w-4 h-4 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Language selector -->
      <LanguageSelector />

      <!-- Notifications -->
      <!-- <UButton variant="ghost" class="text-white hover:bg-white/10">
        <UIcon name="uil:bell" class="w-5 h-5" />
      </UButton> -->

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
      class="border border-bordercolor/70 text-white cursor-pointer rounded-full"
    >
      <UButton
        variant="undefined"
      >
        <UAvatar
          :src="user?.avatarUrl"
          :alt="user ? `${user.name} ${user.lastName}` : 'User'"
          size="xs"
          class="cursor-pointer"
        />
        <span class="text-white font-bold cursor-pointer">{{ user?.name }} {{ user?.lastName }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1 text-white" />
      </UButton>
    </UDropdownMenu>
    </div>
  </div>
</template>

<style scoped>
:deep(.u-input input) {
  color: #fff !important;
}
</style>
