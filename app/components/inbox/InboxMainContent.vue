<script setup lang="ts">
import type { Notifications } from '@/types/inbox'
import { users } from '@/data/users'

defineProps<{
  selectedNotification: Notifications | null
  mainContentWidth: number
}>()

defineEmits(['mark-read', 'open-edit-modal', 'confirm-delete'])
</script>
<template>
  <div
    class="flex-1 flex flex-col transition-all duration-200 ease-out min-w-0"
    :style="{
      opacity: mainContentWidth < 200 ? 0 : 1,
      transform: mainContentWidth < 200 ? 'translateX(50px)' : 'translateX(0)',
    }"
  >
    <div class="bg-gray-800 border-b border-gray-700 px-6 py-4 shrink-0">
      <div class="flex items-center justify-between">
        <div class="min-w-0 flex-1">
          <h1
            class="text-lg font-semibold text-white overflow-hidden whitespace-nowrap"
            :title="selectedNotification?.title || 'Select a notification'"
          >
            {{ selectedNotification?.title || 'Select a notification' }}
          </h1>
          <p
            class="text-sm text-gray-400 mt-1 overflow-hidden whitespace-nowrap"
            :title="
              selectedNotification?.status === 'completed'
                ? 'Reopened by GitHub'
                : selectedNotification?.description ||
                  'Choose a notification to view details'
            "
          >
            {{
              selectedNotification?.status === 'completed'
                ? 'Reopened by GitHub'
                : selectedNotification?.description ||
                  'Choose a notification to view details'
            }}
          </p>
        </div>
        <div
          class="flex items-center gap-2 flex-shrink-0 ml-4 transition-all duration-200"
          :style="{
            opacity: mainContentWidth > 300 ? 1 : 0,
            transform: mainContentWidth > 300 ? 'scale(1)' : 'scale(0.8)',
          }"
        >
          <button
            class="p-2 hover:bg-gray-700 rounded-md transition-colors"
            :disabled="!selectedNotification"
            @click="$emit('mark-read')"
          >
            <Icon name="uil:check" class="w-4 h-4 text-gray-400" />
          </button>
          <button
            class="p-2 hover:bg-gray-700 rounded-md transition-colors"
            :disabled="!selectedNotification"
            @click="$emit('open-edit-modal')"
          >
            <Icon name="uil:edit" class="w-4 h-4 text-gray-400" />
          </button>
          <button
            class="p-2 hover:bg-gray-700 rounded-md transition-colors"
            @click="$emit('confirm-delete', selectedNotification)"
          >
            <Icon name="uil:trash" class="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>

    <div class="flex-1 p-6 overflow-y-auto">
      <div
        v-if="selectedNotification && mainContentWidth > 150"
        class="max-w-2xl"
      >
        <div
          class="bg-gray-800 rounded-lg p-6 mb-6 transition-all duration-200"
        >
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 relative">
              <UAvatar
                :src="
                  users.find((u) => u.id === selectedNotification?.assignee)?.avatarUrl ||
                  '/images/gab.jpg'
                "
                :alt="
                  users.find((u) => u.id === selectedNotification?.assignee)?.name ||
                  'Aucun utilisateur'
                "
                size="lg"
                class="ring-2 ring-black"
              />
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-medium text-white mb-2 break-words">
                {{ selectedNotification.title }}
              </h2>
              <p class="text-gray-300 mb-4 break-words">
                {{ selectedNotification.description }}
              </p>
              <div
                class="flex items-center gap-4 text-sm text-gray-400 transition-all duration-200"
                :style="{
                  opacity: mainContentWidth > 250 ? 1 : 0.7,
                  fontSize: mainContentWidth > 300 ? '0.875rem' : '0.75rem',
                }"
              >
                <span>{{ selectedNotification.time }}</span>
                <span>•</span>
                <span class="capitalize">{{
                  selectedNotification.status
                }}</span>
                <span
                  v-if="selectedNotification.assignee && mainContentWidth > 350"
                  >• {{ selectedNotification.assignee }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="flex items-center justify-center h-64 text-gray-500">
        <div class="text-center">
          <Icon name="uil:bell" class="w-12 h-12 mx-auto mb-4 text-gray-600" />
          <p>
            {{
              mainContentWidth < 150
                ? 'Too narrow'
                : 'Select a notification to view details'
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
