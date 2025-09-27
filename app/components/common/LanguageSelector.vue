<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import 'flag-icons/css/flag-icons.min.css'

const { locale, locales, setLocale } = useI18n()
const router = useRouter()

const switchLanguage = async (localeCode: string) => {
  await setLocale(localeCode)

  // Construire la nouvelle URL avec le bon préfixe de langue
  const currentRoute = router.currentRoute.value
  let newPath = currentRoute.path

  if (localeCode === 'fr') {
    // Supprimer le préfixe /en/ s'il existe
    newPath = newPath.replace(/^\/en/, '') || '/'
  } else if (localeCode === 'en') {
    // Ajouter le préfixe /en/ s'il n'existe pas déjà
    if (!newPath.startsWith('/en')) {
      newPath = `/en${newPath === '/' ? '' : newPath}`
    }
  }

  // Naviguer vers la nouvelle URL
  await navigateTo(newPath)
}

const languageItems = computed<DropdownMenuItem[][]>(() => [
  locales.value.map((loc: any) => ({
    label: loc.name,
    click: () => switchLanguage(loc.code),
    active: locale.value === loc.code,
    flag: loc.flag
  }))
])

const currentLanguage = computed(() => {
  const current = locales.value.find((loc: any) => loc.code === locale.value)
  return current || locales.value[0]
})

// Obtenir la classe CSS pour flag-icons
const getFlagClass = (countryCode: string) => {
  return `fi fi-${countryCode?.toLowerCase() || 'gb'}`
}
</script>

<template>
  <UDropdownMenu
    :items="languageItems"
    :ui="{
      content: 'w-44 bg-background text-white border-none ring-bordercolor border-bordercolor rounded-md overflow-hidden',
      viewport: 'relative divide-y divide-bordercolor overflow-y-auto',
      item: 'group relative w-full flex items-center p-2 text-sm select-none text-white hover:bg-bordercolor/20',
      itemContent: 'w-full flex items-center hover:text-white',
    }"
    color="primary"
    class="bg-bordercolor/70 text-white cursor-pointer"
  >
    <template #trigger>
      <UButton
        variant="ghost"
        class="text-white hover:bg-white/10 px-2 py-1 flex items-center gap-2"
      >
        <span :class="getFlagClass(currentLanguage.flag)" class="w-5 h-4"></span>
        <span class="hidden sm:inline text-sm">{{ currentLanguage.name }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3 h-3 text-white" />
      </UButton>
    </template>

    <template #item="{ item }">
      <div class="flex items-center gap-2 w-full">
        <span :class="getFlagClass(item.flag || 'US')" class="w-5 h-4"></span>
        <span>{{ item.label }}</span>
      </div>
    </template>
  </UDropdownMenu>
</template>