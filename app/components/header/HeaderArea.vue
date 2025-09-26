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

const isProfileModalOpen = ref(false)

const handleItemClick = async (item: DropdownMenuItem) => {
  if (item.label === 'Profile') {
    isProfileModalOpen.value = true
  } else if (item.label === 'Logout') {
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
      label: 'Profile',
      icon: 'i-lucide-user',
      click: () => handleItemClick({ label: 'Profile' })
    }
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
      kbds: ['shift', 'meta', 'q'],
      click: () => handleItemClick({ label: 'Logout' })
    }
  ]
])
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
      <UAvatar
        :src="user?.avatarUrl"
        :alt="user ? `${user.name} ${user.lastName}` : 'User'"
        size="sm"
        class="cursor-pointer"
      />
    </UDropdownMenu>

    <!-- Modal de modification de profil -->
    <UModal v-model="isProfileModalOpen">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-white">Modifier le profil</h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              @click="isProfileModalOpen = false"
            />
          </div>
        </template>

        <ProfileEditForm @close="isProfileModalOpen = false" />
      </UCard>
    </UModal>

    </div>
  </div>
</template>

<style scoped>


</style>
