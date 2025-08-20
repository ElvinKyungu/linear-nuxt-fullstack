<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { validateSignup } from '@/utils/authFormValidation'

const auth = useAuthStore()

const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const handleSignup = async () => {
  errorMessage.value = null
  successMessage.value = null

  // Vérifie la correspondance des mots de passe
  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  const validationError = validateSignup(email.value, password.value, name.value, lastName.value)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  const success = await auth.signup(email.value, password.value, name.value, lastName.value)

  if (success) {
    successMessage.value = 'Inscription réussie ! Vérifiez votre boîte mail.'
    await navigateTo('/login')
  } else {
    errorMessage.value = auth.error
  }
}
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-2xl font-semibold text-gray-800">Create your account</div>
    <p class="text-gray-500">Please fill in the form to sign up</p>

    <form @submit.prevent="handleSignup">
      <div class="space-y-4 flex flex-col">
        <UFormGroup label="First Name">
          <UInput
            v-model="name"
            size="xl"
            placeholder="John"
            icon="uil:user"
            variant="none"
            class="u-input"
          />
        </UFormGroup>

        <UFormGroup label="Last Name">
          <UInput
            v-model="lastName"
            size="xl"
            placeholder="Doe"
            icon="uil:user"
            variant="none"
            class="u-input"
          />
        </UFormGroup>

        <UFormGroup label="Email">
          <UInput
            v-model="email"
            size="xl"
            placeholder="example@email.com"
            icon="uil:envelope"
            variant="none"
            class="u-input"
          />
        </UFormGroup>

        <UFormGroup label="Password">
          <UInput
            v-model="password"
            type="password"
            size="xl"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input"
          />
        </UFormGroup>

        <UFormGroup label="Confirm Password">
          <UInput
            v-model="confirmPassword"
            type="password"
            size="xl"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input"
          />
        </UFormGroup>
      </div>

      <UButton type="submit" block size="lg" color="secondary" class="mt-5 text-white">
        Create Account
      </UButton>

      <p v-if="errorMessage" class="text-sm text-red-500 mt-2 text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-sm text-green-600 mt-2 text-center">
        {{ successMessage }}
      </p>
    </form>

    <p class="text-sm text-center">
      Already have an account?
      <NuxtLink to="/login" class="text-blue-500 hover:underline">Sign in here</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
:deep(.u-input input) {
  color: #000 !important;
}
</style>
