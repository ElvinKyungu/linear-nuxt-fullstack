<script setup lang="ts">
import { validateLogin } from '@/utils/authFormValidation'

const auth = useAuthStore()
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref<string | null>(null)

const handleLogin = async () => {
  const validationError = validateLogin(email.value, password.value)
  if (validationError) {
    errorMessage.value = validationError
    return
  }

  const success = await auth.login(email.value, password.value)

  if (success) {
    await navigateTo('/')
  } else {
    errorMessage.value = auth.error
  }
}
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-2xl font-semibold text-gray-800">Welcome back,</div>
    <UButton block size="lg" color="secondary" variant="outline">
      <template #leading>
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="w-5 h-5" />
      </template>
      Sign in with Google
    </UButton>
    <p class="text-gray-500">Or enter your details</p>

    <AuthProviderLogin />

    <form @submit.prevent="handleLogin">
      <div class="space-y-4 flex flex-col w-full relative">
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
            size="xl"
            type="password"
            placeholder="******"
            icon="uil:lock"
            variant="none"
            class="u-input"
          />
        </UFormGroup>
      </div>

      <div class="flex items-center justify-between text-sm mt-5">
        <label class="flex items-center space-x-2">
          <UCheckbox v-model="rememberMe" color="secondary" />
          <span>Remember me</span>
        </label>
        <a href="#" class="text-secondary hover:underline">Forgot Password?</a>
      </div>

      <UButton type="submit" block size="lg" color="secondary" class="mt-5 text-white">
        Sign in
      </UButton>

      <p v-if="errorMessage" class="text-sm text-red-500 mt-2 text-center">
        {{ errorMessage }}
      </p>
    </form>

    <p class="text-sm text-center">
      Don't have an account?
      <NuxtLink to="/signup" class="hover:underline text-blue-500">Register now</NuxtLink>
    </p>
  </div>
</template>

<style scoped>
:deep(.u-input input) {
  color: #000 !important;
}
</style>
