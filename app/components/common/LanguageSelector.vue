<script setup lang="ts">
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

const currentLanguage = computed(() => {
  const current = locales.value.find((loc: any) => loc.code === locale.value)
  return current || locales.value[0]
})

// Obtenir la classe CSS pour flag-icons
const getFlagClass = (countryCode: string) => {
  return `fi fi-${countryCode?.toLowerCase() || 'us'}`
}
</script>

<template>
  <UPopover>
    <UButton
        variant="ghost"
        class="text-white border border-bordercolor/70 py-2 cursor-pointer rounded-full px-3 flex items-center gap-2"
      >
        <span :class="getFlagClass(currentLanguage.flag)" class="w-5 h-4"/>
        <span class="hidden sm:inline text-sm">{{ currentLanguage.name }}</span>
        <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3 h-3 text-white" />
      </UButton>

    <template #content>
      <div class="bg-background border border-bordercolor rounded-lg shadow-lg min-w-[180px] p-1">
        <div
          v-for="lang in locales"
          :key="lang.code"
          @click="switchLanguage(lang.code)"
          class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bordercolor/20 cursor-pointer transition-colors text-white"
          :class="{ 'bg-blue-600/20 text-blue-400': locale === lang.code }"
        >
          <span :class="getFlagClass(lang.flag)" class="w-5 h-4"></span>
          <span class="text-sm font-medium">{{ lang.name }}</span>
          <UIcon
            v-if="locale === lang.code"
            name="i-heroicons-check-20-solid"
            class="w-4 h-4 text-blue-400 ml-auto"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>