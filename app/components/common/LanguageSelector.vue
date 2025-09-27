<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

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
    active: locale.value === loc.code
  }))
])

const currentLanguage = computed(() => {
  const current = locales.value.find((loc: any) => loc.code === locale.value)
  return current || locales.value[0]
})

const getFlagUrl = (countryCode: string) => {
  return `https://flagsapi.com/${countryCode}/flat/32.png`
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
    <UButton
      variant="ghost"
      class="text-white hover:bg-white/10 px-2 py-1 flex items-center gap-2"
    >
      <img
        :src="getFlagUrl(currentLanguage.flag)"
        :alt="currentLanguage.name"
        class="w-5 h-4 rounded-sm"
      />
      <span class="hidden sm:inline text-sm">{{ currentLanguage.name }}</span>
      <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3 h-3 text-white" />
    </UButton>

    <template #default="{ item }">
      <div class="flex items-center gap-2 w-full">
        <img
          :src="getFlagUrl(locales.find(l => l.name === item.label)?.flag || 'US')"
          :alt="item.label"
          class="w-5 h-4 rounded-sm"
        />
        <span>{{ item.label }}</span>
      </div>
    </template>
  </UDropdownMenu>
</template>