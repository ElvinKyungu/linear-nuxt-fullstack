<script setup lang="ts">
const layoutStore = useLayoutStore()
const authStore = useAuthStore()

const menuItems = [
  {
    label: 'Profile',
    icon: 'uil:user',
    command: () => openProfileModal(),
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
    command: () => handleLogout(),
  },
]

const notifications = [
  { label: 'New comment on your post', icon: 'uil:comment-alt' },
  { label: 'New follower', icon: 'uil:user-plus' },
  { label: 'System update available', icon: 'uil:sync' },
]

const isNotifOpen = ref(false)
const isProfileOpen = ref(false)
const profileModalOpen = ref(false)

const toggleNotif = useToggle(isNotifOpen)
const toggleProfile = useToggle(isProfileOpen)

const openProfileModal = () => {
  isProfileOpen.value = false
  profileModalOpen.value = true
}

const handleLogout = async () => {
  isProfileOpen.value = false
  await authStore.logout()
}

const currentUser = computed(() => authStore.user)
</script>

<template>
  <div
    class="sticky top-0 z-50 text-white w-full rounded-2xl transition-all duration-300 bg-primary"
  >
    <div class="flex items-center justify-between pt-4 px-6">
      <div class="flex items-center gap-4">
        <NuxtLink to="/" class="flex items-center gap-2 text-white text-lg">
          <UButton
            icon="uil:expand-arrows-alt"
            class="text-white cursor-pointer bg-gray-800 hover:bg-gray-700"
            variant="ghost"
            @click="layoutStore.toggleExtend"
          />
          <p>Team {{ 20 }}</p>
        </NuxtLink>
      </div>

      <div class="flex items-center gap-4">
        <div class="relative">
          <UButton
            icon="uil:bell"
            class="text-white cursor-pointer bg-gray-800 hover:bg-gray-700"
            variant="ghost"
            @click="toggleNotif"
          />
          <NPopover placement="bottom-end" trigger="click" class="absolute">
            <ul
              v-if="isNotifOpen"
              class="w-64 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
            >
              <li
                v-for="(notif, index) in notifications"
                :key="index"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700 cursor-pointer"
              >
                <i :class="notif.icon"></i>
                <span>{{ notif.label }}</span>
              </li>
            </ul>
          </NPopover>
        </div>

        <div class="relative">
          <div class="flex items-center gap-2">
            <span v-if="currentUser" class="text-sm hidden md:block">
              {{ currentUser.name }} {{ currentUser.lastName }}
            </span>
            <UAvatar
              :src="currentUser?.avatarUrl"
              :alt="currentUser?.name"
              class="cursor-pointer hover:ring-2 hover:ring-primary"
              @click="toggleProfile"
            />
          </div>

          <NPopover
            v-model:show="isProfileOpen"
            placement="bottom-end"
            trigger="click"
            class="absolute"
          >
            <ul
              v-if="isProfileOpen"
              class="w-48 bg-gray-800 text-white rounded-lg shadow-lg overflow-hidden"
            >
              <li
                v-for="(item, index) in menuItems"
                :key="index"
                class="cursor-pointer"
              >
                <div
                  v-if="item.separator"
                  class="border-t border-gray-600 my-1"
                />
                <div
                  v-else
                  class="flex items-center gap-2 px-4 py-2 hover:bg-gray-700"
                  @click="item.command"
                >
                  <i :class="item.icon"></i>
                  <span>{{ item.label }}</span>
                </div>
              </li>
            </ul>
          </NPopover>
        </div>
      </div>
    </div>
  </div>

  <!-- Profile Modal -->
  <ProfileModal v-model="profileModalOpen" />
</template>
