<script setup lang="ts">
const authStore = useAuthStore()
const email = ref('linear@example.com') // Email de demo
const password = ref('password123') // Mot de passe de demo
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true
    await authStore.login(email.value, password.value)
  } catch (err: any) {
    error.value = authStore.error || 'Erreur de connexion'
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
    <div class="text-2xl font-semibold">Welcome back,</div>
    <UButton 
      block 
      size="lg" 
      color="primary" 
      variant="outline" 
      class="cursor-pointer border border-bordercolor rounded-lg"
      disabled
    >
      <template #leading>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          class="w-5 h-5"
        />
      </template>
      <span class="text-white">Sign in with GitHub</span>
    </UButton>

    <div class="grid w-full grid-cols-3 items-center text-gray-300 text-sm">
      <span class="col-span-1 w-full h-[2px] bg-bordercolor" />
      <p class="text-center col-span-1 w-full">Or enter your details</p>
      <span class="col-span-1 w-full h-[2px] bg-bordercolor" />
    </div>
    
    <form @submit.prevent="handleLogin">
      <div class="space-y-4 flex flex-col w-full relative">
        <UFormGroup label="Email">
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

        <UFormGroup label="Password">
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
          <span>Remember me</span>
        </label>
        <a href="#" class="hover:underline">Forgot Password?</a>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        class="mt-5 text-black hover:bg-amber-50 bg-white cursor-pointer"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </UButton>

      <p v-if="error" class="text-sm text-red-500 mt-2 text-center">
        {{ error }}
      </p>
    </form>

    <p class="text-sm text-center flex gap-2 text-gray-300">
      Don't have an account?
      <NuxtLink to="/signup" class="hover:underline text-blue-300">
        Register now
      </NuxtLink>
    </p>
  </div>
</template>

<style scoped>
:deep(.u-input input) {
  color: #fff !important;
}
</style>