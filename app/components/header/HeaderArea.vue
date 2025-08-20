<script setup lang="ts">
const menuItems = [
  {
    label: 'Profile',
    icon: 'uil:user',
    command: () => console.log('Profile Clicked'),
  },
  {
    label: 'Settings',
    icon: 'uil:cog',
    command: () => console.log('Settings Clicked'),
  },
  { separator: true },
  {
    label: 'Logout',
    icon: 'uil:sign-out-alt',
    command: () => console.log('Logout Clicked'),
  },
]

const notifications = [
  { label: 'New comment on your post', icon: 'uil:comment-alt' },
  { label: 'New follower', icon: 'uil:user-plus' },
  { label: 'System update available', icon: 'uil:sync' },
]

const isNotifOpen = ref(false)
const isProfileOpen = ref(false)

const notifRef = ref(null)
const profileRef = ref(null)

onClickOutside(notifRef, () => (isNotifOpen.value = false))
onClickOutside(profileRef, () => (isProfileOpen.value = false))

const toggleNotif = useToggle(isNotifOpen)
const toggleProfile = useToggle(isProfileOpen)
</script>

<template>
  <div class="sticky top-0 z-50 bg-primary text-white shadow-md w-full">
    <div class="flex items-center justify-between py-4 px-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-white text-lg">
          <span class="mt-1">Yours tasks</span>
        </NuxtLink>
      </div>

      <div
        class="hidden sm:flex flex-grow max-w-md relative border border-gray-700 rounded-full px-6 py-2"
      >
        <UInput
          placeholder="Rechercher..."
          class="w-full outline-none focus:border-none border-none"
          variant="none"
        />
        <UIcon
          name="uil:search"
          class="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-lg text-gray-400"
        />
      </div>

      <div class="flex items-center gap-4">
        <!-- Notifications -->
        <div ref="notifRef" class="relative">
          <UButton @click="toggleNotif()">
            <UIcon name="uil:bell" class="text-2xl cursor-pointer" />
          </UButton>
          <UCard
            v-if="isNotifOpen"
            class="absolute right-0 mt-2 w-64 bg-primary shadow-bordercolor/20 border border-bordercolor shadow-lg rounded-lg"
          >
            <template v-for="(notif, index) in notifications" :key="index">
              <div
                class="flex items-center gap-2 p-3 border-b border-bordercolor cursor-pointer last:border-none"
              >
                <UIcon :name="notif.icon" class="w-7 h-7 text-white" />
                <span class="text-sm">{{ notif.label }}</span>
              </div>
            </template>
          </UCard>
        </div>

        <!-- Profil -->
        <div ref="profileRef" class="relative">
          <NuxtImg
            src="https://avatars.githubusercontent.com/u/85198945?s=400&u=3ee49fab21f5101e3c3ffb96791e135d64290163&v=4"
            class="cursor-pointer rounded-full w-8 h-8"
            @click="toggleProfile()"
          />
          <UCard
            v-if="isProfileOpen"
            class="absolute right-0 mt-2 w-48 bg-primary shadow-bordercolor/20 border border-bordercolor shadow-lg rounded-lg"
          >
            <template v-for="(item, index) in menuItems" :key="index">
              <div v-if="item.separator" class="border-t border-gray-600 my-2" />
              <UButton
                v-else
                variant="ghost"
                class="w-full flex items-center gap-2 py-1 cursor-pointer"
                @click="item.command"
              >
                <span v-if="item.icon" class="flex-shrink-0">
                  <UIcon :name="item.icon" class="w-5 h-5 text-white" />
                </span>
                <span class="text-sm">{{ item.label }}</span>
              </UButton>
            </template>
          </UCard>
        </div>
      </div>
    </div>
  </div>
</template>
