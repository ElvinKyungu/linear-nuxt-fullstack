<template>
  <div class="space-y-6">
    <!-- Upload d'avatar -->
    <div class="flex items-center gap-4">
      <UAvatar
        :src="form.avatarUrl || authStore.user?.avatarUrl"
        :alt="`${form.name} ${form.lastName}`"
        size="lg"
      />
      <div>
        <UButton
          color="primary"
          variant="outline"
          @click="$refs.fileInput.click()"
          :loading="authStore.loading"
        >
          Changer l'avatar
        </UButton>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleAvatarUpload"
        />
        <p class="text-sm text-gray-400 mt-1">JPG, PNG jusqu'à 5MB</p>
      </div>
    </div>

    <!-- Formulaire -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <UFormGroup label="Prénom" required>
          <UInput
            v-model="form.name"
            placeholder="Votre prénom"
            :error="!!errors.name"
          />
          <span v-if="errors.name" class="text-red-400 text-sm">{{ errors.name }}</span>
        </UFormGroup>

        <UFormGroup label="Nom" required>
          <UInput
            v-model="form.lastName"
            placeholder="Votre nom"
            :error="!!errors.lastName"
          />
          <span v-if="errors.lastName" class="text-red-400 text-sm">{{ errors.lastName }}</span>
        </UFormGroup>
      </div>

      <UFormGroup label="Email" required>
        <UInput
          v-model="form.email"
          type="email"
          placeholder="votre@email.com"
          :error="!!errors.email"
        />
        <span v-if="errors.email" class="text-red-400 text-sm">{{ errors.email }}</span>
      </UFormGroup>

      <UFormGroup label="Rôle">
        <UInput
          v-model="form.role"
          placeholder="Votre rôle"
          :error="!!errors.role"
        />
        <span v-if="errors.role" class="text-red-400 text-sm">{{ errors.role }}</span>
      </UFormGroup>

      <!-- Changement de mot de passe (optionnel) -->
      <div class="border-t border-bordercolor pt-4">
        <h4 class="text-md font-medium text-white mb-3">Changer le mot de passe</h4>
        <div class="space-y-3">
          <UFormGroup label="Nouveau mot de passe">
            <UInput
              v-model="form.password"
              type="password"
              placeholder="Nouveau mot de passe (optionnel)"
              :error="!!errors.password"
            />
            <span v-if="errors.password" class="text-red-400 text-sm">{{ errors.password }}</span>
          </UFormGroup>

          <UFormGroup label="Confirmer le mot de passe" v-if="form.password">
            <UInput
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirmer le mot de passe"
              :error="!!errors.confirmPassword"
            />
            <span v-if="errors.confirmPassword" class="text-red-400 text-sm">{{ errors.confirmPassword }}</span>
          </UFormGroup>
        </div>
      </div>

      <!-- Messages d'erreur général -->
      <div v-if="authStore.error" class="bg-red-500/10 border border-red-500 rounded-lg p-3">
        <p class="text-red-400 text-sm">{{ authStore.error }}</p>
      </div>

      <!-- Boutons d'action -->
      <div class="flex justify-end gap-3 pt-4">
        <UButton
          color="gray"
          variant="ghost"
          @click="$emit('close')"
          :disabled="authStore.loading"
        >
          Annuler
        </UButton>
        <UButton
          type="submit"
          color="primary"
          :loading="authStore.loading"
          :disabled="!isFormValid"
        >
          Sauvegarder
        </UButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface ProfileForm {
  name: string
  lastName: string
  email: string
  role: string
  password: string
  confirmPassword: string
  avatarUrl?: string
}

const emit = defineEmits(['close'])

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

// Formulaire réactif
const form = reactive<ProfileForm>({
  name: user.value?.name || '',
  lastName: user.value?.lastName || '',
  email: user.value?.email || '',
  role: user.value?.role || '',
  password: '',
  confirmPassword: '',
  avatarUrl: user.value?.avatarUrl || ''
})

// Validation des erreurs
const errors = reactive({
  name: '',
  lastName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
})

// Validation du formulaire
const isFormValid = computed(() => {
  return form.name.trim() &&
         form.lastName.trim() &&
         form.email.trim() &&
         isValidEmail(form.email) &&
         (!form.password || form.password === form.confirmPassword)
})

// Fonction de validation email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validation en temps réel
watch(() => form.email, (newEmail) => {
  if (newEmail && !isValidEmail(newEmail)) {
    errors.email = 'Email invalide'
  } else {
    errors.email = ''
  }
})

watch(() => form.name, (newName) => {
  if (!newName.trim()) {
    errors.name = 'Le prénom est requis'
  } else {
    errors.name = ''
  }
})

watch(() => form.lastName, (newLastName) => {
  if (!newLastName.trim()) {
    errors.lastName = 'Le nom est requis'
  } else {
    errors.lastName = ''
  }
})

watch(() => [form.password, form.confirmPassword], ([password, confirmPassword]) => {
  if (password && password !== confirmPassword) {
    errors.confirmPassword = 'Les mots de passe ne correspondent pas'
  } else {
    errors.confirmPassword = ''
  }

  if (password && password.length < 6) {
    errors.password = 'Le mot de passe doit contenir au moins 6 caractères'
  } else {
    errors.password = ''
  }
})

// Upload d'avatar
const handleAvatarUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  // Validation du fichier
  if (!file.type.startsWith('image/')) {
    errors.avatarUrl = 'Veuillez sélectionner une image'
    return
  }

  if (file.size > 5 * 1024 * 1024) { // 5MB
    errors.avatarUrl = 'L\'image doit faire moins de 5MB'
    return
  }

  try {
    const updatedUser = await authStore.uploadAvatar(file)
    form.avatarUrl = updatedUser.avatarUrl
  } catch (error) {
    console.error('Erreur upload avatar:', error)
  }
}

// Soumission du formulaire
const handleSubmit = async () => {
  // Validation finale
  if (!isFormValid.value) return

  try {
    const updates: Partial<User> = {
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      role: form.role.trim()
    }

    // Ajouter le mot de passe si fourni
    if (form.password) {
      updates.password = form.password
    }

    await authStore.updateProfile(updates)
    emit('close')
  } catch (error) {
    console.error('Erreur mise à jour profil:', error)
  }
}
</script>