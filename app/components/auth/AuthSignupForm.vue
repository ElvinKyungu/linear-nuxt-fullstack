<script setup lang="ts">
const auth = useAuthStore()
const { t } = useI18n()

const name = ref('')
const lastName = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref<string | null>(null)
const successMessage = ref<string | null>(null)

const handleSignup = async () => {
  loading.value = true
  errorMessage.value = null
  successMessage.value = null

  if (password.value !== confirmPassword.value) {
    errorMessage.value = t('auth.passwordsDontMatch')
    return
  }
  try {
    const success = await auth.signup(
      email.value,
      password.value,
      name.value,
      lastName.value
    )

    if (success) {
      successMessage.value = t('auth.signupSuccess')
      await navigateTo('/login')
    }
  } catch {
    errorMessage.value = auth.error
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-2xl font-semibold text-gray-800">{{ t('auth.createYourAccount') }}</div>
    <p class="text-gray-300">{{ t('auth.fillFormToSignup') }}</p>

    <form @submit.prevent="handleSignup">
      <div class="space-y-4 flex flex-col">
        <UFormGroup :label="t('auth.firstName')">
          <UInput
            v-model="name"
            size="xl"
            placeholder="John"
            icon="uil:user"
            variant="none"
            class="u-input border border-bordercolor text-white"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.lastName')">
          <UInput
            v-model="lastName"
            size="xl"
            placeholder="Doe"
            icon="uil:user"
            variant="none"
            class="u-input border border-bordercolor"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.email')">
          <UInput
            v-model="email"
            size="xl"
            placeholder="example@email.com"
            icon="uil:envelope"
            variant="none"
            class="u-input border border-bordercolor"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.password')">
          <UInput
            v-model="password"
            type="password"
            size="xl"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input border border-bordercolor"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.confirmPassword')">
          <UInput
            v-model="confirmPassword"
            type="password"
            size="xl"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input border border-bordercolor"
          />
        </UFormGroup>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        class="mt-5 text-black bg-white cursor-pointer"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? t('auth.creatingAccount') : t('auth.createAccount') }}
      </UButton>

      <p v-if="errorMessage" class="text-sm text-red-500 mt-2 text-center">
        {{ errorMessage }}
      </p>
      <p v-if="successMessage" class="text-sm text-green-600 mt-2 text-center">
        {{ successMessage }}
      </p>
    </form>

    <p class="text-sm text-center">
      {{ t('auth.alreadyHaveAccount') }}
      <NuxtLink to="/login" class="text-blue-500 hover:underline"
        >{{ t('auth.signInHere') }}</NuxtLink
      >
    </p>
  </div>
</template>

<style scoped></style>
