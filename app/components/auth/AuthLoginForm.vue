<script setup lang="ts">
const { signIn, data: sessionData } = useAuth()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errorMessage = ref<string | null>(null)
const loading = ref(false)

// Connexion par email/mot de passe
const handleLogin = async () => {
  loading.value = true
  errorMessage.value = null
  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      await navigateTo('/')
    } else {
      errorMessage.value = authStore.error
    }
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

// Connexion GitHub
const handleGithubLogin = async () => {
  try {
    await signIn('github', { callbackUrl: '/' })
  } catch (error) {
    errorMessage.value = 'Erreur lors de la connexion GitHub'
  }
}

// Redirection si déjà connecté
watch(sessionData, (session) => {
  if (session) {
    navigateTo('/')
  }
})
</script>

<template>
  <div class="w-full max-w-md space-y-6">
    <div class="text-2xl font-semibold">Welcome back,</div>
    
    <!-- Connexion GitHub -->
    <UButton 
      block 
      size="lg" 
      color="primary" 
      variant="outline" 
      class="cursor-pointer"
      @click="handleGithubLogin"
    >
      <template #leading>
        <img
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          class="w-5 h-5"
        />
      </template>
      <span class="text-white">Sign in with GitHub</span>
    </UButton>
    
    <p>Or enter your details</p>

    <!-- Formulaire email/password -->
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
          />
        </UFormGroup>
      </div>

      <div class="flex items-center justify-between text-sm mt-5 text-gray-300">
        <label class="flex items-center space-x-2">
          <UCheckbox v-model="rememberMe" color="secondary" />
          <span>Remember me</span>
        </label>
        <a href="#" class="hover:underline">Forgot Password?</a>
      </div>

      <UButton
        type="submit"
        block
        size="lg"
        color="primary"
        class="mt-5 text-white cursor-pointer"
        :loading="loading"
        :disabled="loading"
      >
        {{ loading ? 'Signing in...' : 'Sign in' }}
      </UButton>

      <p v-if="errorMessage" class="text-sm text-red-500 mt-2 text-center">
        {{ errorMessage }}
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