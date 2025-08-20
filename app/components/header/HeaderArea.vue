<script setup lang="ts">

const layoutStore = useLayoutStore()
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
  <div
    class="sticky top-0 z-50 bg-primary text-white shadow-md w-full rounded-2xl transition-all duration-300"
  >
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
        <UButton
          icon="uil:expand-arrows-alt"
          class="text-white"
          @click="layoutStore.toggleExtend"
        />
      </div>
    </div>
  </div>
</template>
