<!-- layouts/default.vue -->
<script setup lang="ts">
import gsap from 'gsap'

const sidebarStore = useSidebarStore()
const sidebarWrapRef = ref<HTMLElement | null>(null)
const isInitialized = ref(false)

// Détecter la taille d'écran
const screenSize = ref<'mobile' | 'tablet' | 'desktop'>('desktop')
const isMobileOrTablet = computed(() => screenSize.value !== 'desktop')

// Fonction pour détecter la taille d'écran
const updateScreenSize = () => {
  const width = window.innerWidth
  if (width < 768) {
    screenSize.value = 'mobile'
  } else if (width < 1024) {
    screenSize.value = 'tablet'
  } else {
    screenSize.value = 'desktop'
  }
}

// État de la sidebar basé sur la taille d'écran
const shouldSidebarBeHidden = computed(() => {
  if (isMobileOrTablet.value) {
    // Sur mobile/tablet, on se base sur isSidebarOpen (true = visible, false = caché)
    return !sidebarStore.isSidebarOpen
  } else {
    // Sur desktop, on se base sur isExtended (true = fermé, false = ouvert)
    return sidebarStore.isExtended
  }
})

// Animation de la sidebar
const animateSidebar = (hide: boolean) => {
  const wrap = sidebarWrapRef.value
  const aside = wrap?.querySelector('aside') as HTMLElement | null
  if (!wrap || !aside) return

  if (hide) {
    // Fermer/cacher la sidebar
    gsap
      .timeline()
      .to(
        aside,
        {
          x: '-100%',
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        wrap,
        {
          width: 0,
          opacity: 0,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        0
      )
  } else {
    // Réouvrir/afficher la sidebar
    gsap
      .timeline()
      .to(
        wrap,
        {
          width: '20rem',
          opacity: 1,
          duration: 0.35,
          ease: 'power2.inOut',
        },
        0
      )
      .to(
        aside,
        {
          x: '0%',
          duration: 0.3,
          ease: 'power2.inOut',
        },
        0.05
      )
  }
}

// Watcher pour les changements d'état de la sidebar
watch(shouldSidebarBeHidden, (hide) => {
  if (isInitialized.value) {
    animateSidebar(hide)
  }
})

// Gestion du redimensionnement de la fenêtre
const handleResize = () => {
  const oldScreenSize = screenSize.value
  updateScreenSize()

  // Si on change de catégorie d'écran, on réinitialise
  if (oldScreenSize !== screenSize.value && isInitialized.value) {
    // Sur mobile/tablet, on force la fermeture
    if (isMobileOrTablet.value) {
      sidebarStore.closeSidebar() // Utilise la méthode du store
    } else {
      // Sur desktop, on peut rouvrir selon l'état du store
      if (sidebarStore.isExtended) {
        animateSidebar(true)
      } else {
        animateSidebar(false)
      }
    }
  }
}

// Initialisation
onMounted(() => {
  updateScreenSize()

  // Configuration initiale basée sur la taille d'écran
  if (isMobileOrTablet.value) {
    // Sur mobile, la sidebar est cachée par défaut
    sidebarStore.closeSidebar()
    const wrap = sidebarWrapRef.value
    if (wrap) {
      gsap.set(wrap, { width: 0, opacity: 0 })
      const aside = wrap.querySelector('aside') as HTMLElement | null
      if (aside) {
        gsap.set(aside, { x: '-100%' })
      }
    }
  } else {
    // Sur desktop, respecter l'état du store
    if (sidebarStore.isExtended) {
      const wrap = sidebarWrapRef.value
      if (wrap) {
        gsap.set(wrap, { width: 0, opacity: 0 })
        const aside = wrap.querySelector('aside') as HTMLElement | null
        if (aside) {
          gsap.set(aside, { x: '-100%' })
        }
      }
    }
  }

  isInitialized.value = true

  // Écouter les changements de taille
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Fonction utilitaire pour forcer l'ouverture/fermeture
const toggleSidebar = () => {
  sidebarStore.toggleExtend()
}

// Classes réactives pour le contenu principal
const mainContentClasses = computed(() => ({
  'w-full': shouldSidebarBeHidden.value,
  'transition-all duration-300 ease-in-out': true,
}))

// Déterminer l'icône du bouton toggle
const toggleIcon = computed(() => {
  if (isMobileOrTablet.value) {
    // Sur mobile, toujours afficher l'icône "bars" car on ouvre un overlay
    return 'uil:bars'
  } else {
    // Sur desktop, changer selon l'état
    return sidebarStore.isExtended ? 'uil:bars' : 'uil:times'
  }
})
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <!-- Sidebar Container -->
    <div
      ref="sidebarWrapRef"
      class="shrink-0 overflow-hidden relative"
      :class="{
        'w-80': !shouldSidebarBeHidden,
        'w-0': shouldSidebarBeHidden,
      }"
    >
      <SidebarArea />
    </div>

    <!-- Main Content Area -->
    <div
      class="relative flex flex-1 flex-col overflow-hidden border border-bordercolor m-2 rounded-xl"
      :class="mainContentClasses"
    >
      <!-- Header avec bouton toggle responsive -->
      <header class="shrink-0 relative">
        <HeaderArea>
          <!-- Slot pour ajouter le bouton toggle dans le header -->
          <template #sidebar-toggle>
            <UButton
              variant="ghost"
              class="lg:inline-flex text-white hover:bg-white/10 cursor-pointer"
              @click="toggleSidebar"
            >
              <UIcon :name="'uil:bars'" class="w-5 h-5" />
            </UButton>
          </template>
        </HeaderArea>
      </header>

      <!-- Contenu scrollable -->
      <main class="flex-1 overflow-y-auto bg-primary">
        <div class="mx-auto max-w-screen-4xl p-1 md:p-2 2xl:p-3">
          <slot />
        </div>
      </main>
    </div>

    <!-- Overlay pour mobile quand sidebar est ouverte -->
    <div
      v-if="isMobileOrTablet && sidebarStore.isSidebarOpen"
      class="fixed inset-0 bg-black/90 z-40 lg:hidden"
      @click="sidebarStore.closeSidebar()"
    >
      <p
        class="text-white absolute right-3/12 translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        {{ 'Click outside to close' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

.flex-1 {
  flex: 1 1 0%;
}

@media (max-width: 1023px) {
  .sidebar-hidden {
    transform: translateX(-100%);
  }
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
</style>
