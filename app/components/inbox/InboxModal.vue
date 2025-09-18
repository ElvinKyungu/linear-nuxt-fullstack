<script setup lang="ts">
import type { Notifications } from '@/types/inbox'
import { users } from '@/data/users'
import type { User } from '~/types/users';

const props = defineProps<{
  formData: Partial<Notifications>
  editItem: Notifications | null
}>()

const emit = defineEmits(['close-modal', 'submit-modal'])

const createTaskPopover = ref(false)
const localForm = reactive<Partial<Notifications>>({
  title: '',
  description: '',
  time: '',
  isReaded: false,
  icon: 'uil:bell',
  color: '#6b7280',
  assignee: '',
  status: 'info',
  url: '',
})

watch(
  () => props.formData,
  (newVal) => {
    Object.assign(localForm, newVal)
  },
  { immediate: true }
)

const show = ref(true)
const modalContent = ref<HTMLElement | null>(null)

const userSearch = ref('')
const filteredUsers = computed(() =>
  users.filter((u) =>
    `${u.name} ${u.lastName}`
      .toLowerCase()
      .includes(userSearch.value.toLowerCase())
  )
)

const selectUser = (user: User) => {
  localForm.assignee = user.id
  createTaskPopover.value = false
}

const { showModal, hideModal } = useGsapModal()

const statusOptions = ['info', 'warning', 'completed', 'error']

const submit = () => {
  emit('submit-modal', localForm)
}

const closeModal = () => {
  show.value = false
  hideModal(modalContent.value!, () => {
    emit('close-modal')
  })
}

const onEnter = (el: Element, done: () => void) => {
  showModal(el as HTMLElement)
  done()
}

const onLeave = (el: Element, done: () => void) => {
  hideModal(el as HTMLElement, done)
}
</script>

<template>
  <Transition :css="false" appear @enter="onEnter" @leave="onLeave">
    <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center z-50 p-4"
    >
      <div
        class="fixed z-20 bg-background/80 w-full h-screen"
        @click="closeModal"
      />
      <div
        ref="modalContent"
        class="bg-gray-900 rounded-md p-4 w-full max-w-lg z-30"
      >
        <h3 class="text-lg font-semibold mb-3 text-gray-300">
          {{ editItem ? 'Modifier notification' : 'Créer notification' }}
        </h3>
        <div class="grid grid-cols-1 gap-4">
          <UInput
            v-model="localForm.title"
            placeholder="Titre"
            variant="none"
            size="xl"
            class="u-input border border-bordercolor"
          />
          <UInput
            v-model="localForm.description"
            placeholder="Description"
            variant="none"
            size="lg"
            class="u-input border border-bordercolor"
          />
          <div class="grid grid-cols-2 gap-4">
            <UInput
              v-model="localForm.time"
              placeholder="temps (ex: 2h, 3d)"
              variant="none"
              class="u-input border border-bordercolor"
            />
            <UPopover v-model:open="createTaskPopover">
              <div
                class="flex gap-2 items-center cursor-pointer hover:bg-gray-800/50 rounded p-1"
              >
                <UAvatar
                  :src="
                    users.find((u) => u.id === localForm.assignee)?.avatarUrl ||
                    '/images/gab.jpg'
                  "
                  :alt="
                    users.find((u) => u.id === localForm.assignee)?.name ||
                    'Aucun utilisateur'
                  "
                  size="sm"
                  class="ring-2 ring-black"
                />
                <span class="text-gray-300 font-medium">
                  <template v-if="localForm.assignee">
                    {{
                      users
                        .find((u) => u.id === localForm.assignee)
                        ?.name?.toLowerCase()
                    }}.{{
                      users
                        .find((u) => u.id === localForm.assignee)
                        ?.lastName?.toLowerCase()
                    }}
                  </template>
                  <template v-else> Click to assign </template>
                </span>
              </div>

              <template #content>
                <div
                  class="bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 max-w-64"
                >
                  <div class="flex flex-col gap-2 mb-3">
                    <h2 class="text-sm font-medium">Assign Lead</h2>
                    <UInput
                      v-model="userSearch"
                      icon="i-heroicons-magnifying-glass"
                      placeholder="Search users..."
                      size="sm"
                    />
                  </div>
                  <div class="space-y-1 max-h-64 overflow-y-auto">
                    <div
                      v-for="user in filteredUsers"
                      :key="user.id"
                      class="flex items-center gap-4 justify-between px-2 py-1 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
                      @click="selectUser(user)"
                    >
                      <div class="flex items-center gap-3">
                        <UAvatar
                          :src="user.avatarUrl"
                          :alt="user.name"
                          size="xs"
                          class="ring-2 ring-black"
                        />
                        <div class="flex flex-col items-start">
                          <span class="text-white"
                            >{{ user.name }} {{ user.lastName }}</span
                          >
                          <span class="text-xs text-gray-400">{{
                            user.email
                          }}</span>
                        </div>
                      </div>
                      <UIcon
                        v-if="localForm.assignee === user.id"
                        name="i-heroicons-check"
                        class="text-green-500"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </UPopover>
          </div>

          <div class="flex items-center gap-4">
            <UInput
              v-model="localForm.icon"
              placeholder="icône (uil:...)"
              variant="none"
              class="u-input border border-bordercolor flex-1"
            />
            <UInput
              v-model="localForm.color"
              placeholder="#hex"
              variant="none"
              class="u-input border border-bordercolor w-32"
            />
          </div>

          <div class="flex items-center gap-4">
            <UCheckbox
              v-model="localForm.isReaded"
              label="Lu"
              :ui="{ label: 'text-gray-300' }"
            />
            <USelect
              v-model="localForm.status"
              :options="statusOptions"
              variant="none"
              class="flex-1 u-select"
            />
          </div>
        </div>

        <div class="mt-4 flex justify-end gap-2">
          <UButton
            label="Annuler"
            variant="ghost"
            icon="i-heroicons-x-mark"
            class="bg-white hover:bg-white cursor-pointer"
            @click="closeModal"
          />
          <UButton
            :label="editItem ? 'Enregistrer' : 'Créer'"
            icon="i-heroicons-check"
            class="bg-white hover:bg-white cursor-pointer"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
:deep(.u-input input, .u-input textarea, .u-input select) {
  color: #fff !important;
}

:deep(.u-select) select {
  background-color: transparent !important;
  border-color: #4b5563 !important;
  color: #fff !important;
}
</style>
