<template>
  <div class="min-h-screen flex">
    <div
      class="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-800 text-white"
    >
      <slot />
    </div>
    <AuthAside />
  </div>
</template>

<script setup lang="ts"></script>
