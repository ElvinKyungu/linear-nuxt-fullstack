<script setup lang="ts">
import { useGsapModal } from '@/composables/useGsapModal'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits(['update:modelValue'])

const authStore = useAuthStore()
const modal = ref<HTMLElement | null>(null)
const { showModal, hideModal } = useGsapModal()

const form = reactive({
  name: '',
  lastName: '',
  email: '',
})

const loading = ref(false)
const error = ref('')
const success = ref('')

// Initialiser le formulaire avec les données utilisateur
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      if (authStore.user) {
        form.name = authStore.user.name
        form.lastName = authStore.user.lastName
        form.email = authStore.user.email
      }
      if (modal.value) showModal(modal.value)
    }
  }
)

const close = () => {
  if (modal.value) {
    hideModal(modal.value, () => {
      emit('update:modelValue', false)
      error.value = ''
      success.value = ''
    })
  }
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  success.value = ''

  try {
    await authStore.updateProfile(form)
    success.value = 'Profil mis à jour avec succès!'
    setTimeout(() => close(), 1500)
  } catch {
    error.value = authStore.error || 'Erreur lors de la mise à jour'
  } finally {
    loading.value = false
  }
}

const handleAvatarChange = async () => {
  loading.value = true
  error.value = ''

  try {
    // Pour cette démo, on change juste l'avatar aléatoirement
    await authStore.uploadAvatar(new File([], 'avatar'))
    success.value = 'Avatar mis à jour!'
  } catch {
    error.value = authStore.error || "Erreur lors de la mise à jour de l'avatar"
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4"
      @click="close"
    >
      <div
        ref="modal"
        class="bg-primary border border-bordercolor rounded-xl shadow-lg p-6 w-full max-w-md text-white"
        @click.stop
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold">Mon Profil</h2>
          <UButton
            icon="uil:times"
            variant="ghost"
            class="text-gray-400 hover:text-white"
            @click="close"
          />
        </div>

        <!-- Avatar Section -->
        <div class="flex flex-col items-center mb-6">
          <UAvatar
            :src="authStore.user?.avatarUrl"
            :alt="authStore.user?.name"
            size="xl"
            class="mb-3"
          />
          <UButton
            variant="outline"
            size="sm"
            class="text-white border-bordercolor"
            :loading="loading"
            @click="handleAvatarChange"
          >
            Changer l'avatar
          </UButton>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <UFormGroup label="Prénom">
            <UInput
              v-model="form.name"
              class="u-input border border-bordercolor"
              placeholder="Votre prénom"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="Nom">
            <UInput
              v-model="form.lastName"
              class="u-input border border-bordercolor"
              placeholder="Votre nom"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <UFormGroup label="Email">
            <UInput
              v-model="form.email"
              type="email"
              class="u-input border border-bordercolor"
              placeholder="Votre email"
              required
              :disabled="loading"
            />
          </UFormGroup>

          <!-- Messages -->
          <div v-if="error" class="text-red-500 text-sm text-center">
            {{ error }}
          </div>

          <div v-if="success" class="text-green-500 text-sm text-center">
            {{ success }}
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4">
            <UButton
              type="button"
              variant="outline"
              class="flex-1 border-bordercolor text-white"
              :disabled="loading"
              @click="close"
            >
              Annuler
            </UButton>
            <UButton
              type="submit"
              class="flex-1 bg-white text-black hover:bg-gray-100"
              :loading="loading"
            >
              Sauvegarder
            </UButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
:deep(.u-input input) {
  color: #fff !important;
}
</style>
