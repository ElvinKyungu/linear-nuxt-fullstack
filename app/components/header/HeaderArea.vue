<!-- HeaderArea.vue -->
<template>
  <div
    class="flex items-center justify-between p-4 bg-primary border-b border-bordercolor"
  >
    <!-- Section gauche avec toggle sidebar -->
    <div class="flex items-center gap-4">
      <!-- Bouton toggle sidebar (visible uniquement sur desktop) -->
      <slot name="sidebar-toggle" />

      <!-- Titre ou breadcrumb -->
      <div class="flex items-center gap-2">
        <h1 class="text-xl font-semibold text-white">
          {{ pageTitle }}
        </h1>
      </div>
    </div>

    <!-- Section centrale (optionnelle) -->
    <div class="hidden md:flex items-center gap-4">
      <slot name="center-content" />
    </div>

    <!-- Section droite -->
    <div class="flex items-center gap-3">
      <!-- Recherche (optionnelle) -->
      <div class="hidden lg:block">
        <UInput placeholder="Search..." class="w-64" variant="outline">
          <template #leading>
            <UIcon name="uil:search" class="w-4 h-4 text-gray-400" />
          </template>
        </UInput>
      </div>

      <!-- Notifications -->
      <UButton variant="ghost" class="text-white hover:bg-white/10">
        <UIcon name="uil:bell" class="w-5 h-5" />
      </UButton>

      <!-- Menu utilisateur -->
      <UDropdown>
        <template #trigger>
          <UButton variant="ghost" class="text-white hover:bg-white/10">
            <UIcon name="uil:user-circle" class="w-6 h-6" />
          </UButton>
        </template>

        <template #content>
          <div class="p-2">
            <UButton variant="ghost" class="w-full justify-start">
              <UIcon name="uil:user" class="w-4 h-4 mr-2" />
              Profile
            </UButton>
            <UButton variant="ghost" class="w-full justify-start">
              <UIcon name="uil:setting" class="w-4 h-4 mr-2" />
              Settings
            </UButton>
            <UDivider class="my-2" />
            <UButton variant="ghost" class="w-full justify-start text-red-400">
              <UIcon name="uil:sign-out-alt" class="w-4 h-4 mr-2" />
              Logout
            </UButton>
          </div>
        </template>
      </UDropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  pageTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  pageTitle: 'Dashboard',
})

// Vous pouvez ajouter d'autres logiques spécifiques au header ici
</script>

<style scoped>
/* Styles spécifiques au header si nécessaire */
</style>
