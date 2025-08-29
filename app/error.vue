<script setup lang="ts">
const error = useError()
</script>

<template>
  <section class="bg-primary h-screen flex justify-center items-center">
    <UContainer class="py-12 lg:py-20 text-center">
      <div class="max-w-screen-sm mx-auto">
        <h1 class="mb-4 text-7xl font-extrabold tracking-tight lg:text-9xl text-primary-600 dark:text-primary-500">
          {{ error?.statusCode || 'Inconnu' }}
        </h1>
        <p class="mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          Oops... An error occurred 😢
        </p>
        <p class="mb-6 text-lg md:text-xl font-light text-gray-500 dark:text-gray-400">
          {{ error?.message || 'Try reloading the page or going back to the home page to explore our Nuxt UI components.' }}
        </p>
        <UButton
          to="/"
          size="lg"
          class="my-4 px-5 bg-white hover:bg-white font-medium text-lg"
        >
          Back to Homepage
        </UButton>
      </div>
    </UContainer>
  </section>
</template>
