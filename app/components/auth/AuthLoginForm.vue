<script setup lang="ts">
const authStore = useAuthStore()
const email = ref('linear@example.com') // Email de demo
const password = ref('password123') // Mot de passe de demo
const error = ref('')
const loading = ref(false)

const { t } = useI18n()

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true
    await authStore.login(email.value, password.value)
  } catch {
    error.value = authStore.error || t('auth.connectionError')
  } finally {
    loading.value = false
  }
}

// Redirection automatique si l'utilisateur est déjà connecté
watchEffect(() => {
  if (authStore.user) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-2xl font-semibold">{{ t('auth.welcomeBack') }}</div>
    <UButton
      block
      size="lg"
      color="primary"
      variant="outline"
      class="cursor-pointer border border-bordercolor rounded-lg"
      disabled
    >
      <template #leading>
        <UIcon name="uil:github" class="w-5 h-5 text-white" />
      </template>
      <span class="text-white">{{ t('auth.signInWithGithub') }}</span>
    </UButton>

    <div class="grid w-full grid-cols-3 items-center text-gray-300 text-sm">
      <span class="col-span-1 w-full h-[2px] bg-bordercolor" />
      <p class="text-center col-span-1 w-full">{{ t('auth.orEnterDetails') }}</p>
      <span class="col-span-1 w-full h-[2px] bg-bordercolor" />
    </div>

    <form @submit.prevent="handleLogin">
      <div class="space-y-4 flex flex-col w-full relative">
        <UFormGroup :label="t('auth.email')">
          <UInput
            v-model="email"
            size="xl"
            placeholder="example@email.com"
            icon="uil:envelope"
            variant="none"
            class="u-input border border-bordercolor"
            :disabled="loading"
            required
            type="email"
          />
        </UFormGroup>

        <UFormGroup :label="t('auth.password')">
          <UInput
            v-model="password"
            size="xl"
            type="password"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input border border-bordercolor"
            :disabled="loading"
            required
          />
        </UFormGroup>
      </div>

      <div class="flex items-center justify-between text-sm mt-5 text-gray-300">
        <label class="flex items-center space-x-2">
          <UCheckbox color="secondary" />
          <span>{{ t('auth.rememberMe') }}</span>
        </label>
        <a href="#" class="hover:underline">{{ t('auth.forgotPassword') }}</a>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        class="mt-5 text-black hover:bg-amber-50 bg-white cursor-pointer"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? t('auth.signingIn') : t('auth.signIn') }}
      </UButton>

      <p v-if="error" class="text-sm text-red-500 mt-2 text-center">
        {{ error }}
      </p>
    </form>

    <p class="text-sm text-center flex gap-2 text-gray-300">
      {{ t('auth.dontHaveAccount') }}
      <NuxtLink to="/signup" class="hover:underline text-blue-300">
        {{ t('auth.registerNow') }}
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
:deep(.u-input input) {
  color: #fff !important;
}
</style>
