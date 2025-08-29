<!-- app/error.vue -->
<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-6">
    <h1 class="text-5xl font-bold text-red-600 mb-4">
      Oups! {{ error.statusCode }}
    </h1>
    <p class="text-lg text-gray-700 mb-6">
      {{ error.message || 'Une erreur est survenue.' }}
    </p>
    <NuxtLink to="/" class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
      Retour à l’accueil
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()
</script>
