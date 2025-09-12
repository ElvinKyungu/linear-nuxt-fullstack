// stores/sidebar.ts
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  // États principaux
  const isExtended = ref(false) // true = fermé, false = ouvert
  const isSidebarOpen = ref(false) // pour la version mobile overlay
  const screenSize = ref<'mobile' | 'tablet' | 'desktop'>('desktop')

  // État précédent pour la restauration
  const previousDesktopState = ref(false)

  // États calculés
  const isMobile = computed(() => screenSize.value === 'mobile')
  const isTablet = computed(() => screenSize.value === 'tablet')
  const isDesktop = computed(() => screenSize.value === 'desktop')
  const isMobileOrTablet = computed(() => screenSize.value !== 'desktop')
  const shouldShowSidebar = computed(() => !isExtended.value && isDesktop.value)

  // Fonction pour détecter et mettre à jour la taille d'écran
  const updateScreenSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      const oldSize = screenSize.value

      if (width < 768) {
        screenSize.value = 'mobile'
      } else if (width < 1024) {
        screenSize.value = 'tablet'
      } else {
        screenSize.value = 'desktop'
      }

      // Gestion des changements de taille d'écran
      if (oldSize !== screenSize.value) {
        // Si on passe de mobile/tablet à desktop, restaurer l'état précédent
        if (
          (oldSize === 'mobile' || oldSize === 'tablet') &&
          screenSize.value === 'desktop'
        ) {
          isExtended.value = previousDesktopState.value
          isSidebarOpen.value = false // Fermer l'overlay mobile
        }

        // Si on passe à mobile/tablet, sauvegarder l'état desktop et fermer
        if (
          oldSize === 'desktop' &&
          (screenSize.value === 'mobile' || screenSize.value === 'tablet')
        ) {
          previousDesktopState.value = isExtended.value
          isExtended.value = true // Fermer sur mobile/tablet
          isSidebarOpen.value = false
        }
      }
    }
  }

  // Toggle la sidebar selon le contexte
  const toggleExtend = () => {
    if (isDesktop.value) {
      // Sur desktop, toggle l'état extended (collapse/expand)
      isExtended.value = !isExtended.value
      previousDesktopState.value = isExtended.value
    } else {
      // Sur mobile/tablet, toggle l'overlay
      isSidebarOpen.value = !isSidebarOpen.value
    }
  }

  // Forcer l'état de la sidebar (pour desktop principalement)
  const setSidebarState = (state: boolean) => {
    isExtended.value = state
    if (isDesktop.value) {
      previousDesktopState.value = state
    }
  }

  // Ouvrir la sidebar
  const openSidebar = () => {
    if (isDesktop.value) {
      setSidebarState(false) // false = ouvert sur desktop
    } else {
      isSidebarOpen.value = true // true = visible sur mobile
    }
  }

  // Fermer la sidebar
  const closeSidebar = () => {
    if (isDesktop.value) {
      setSidebarState(true) // true = fermé sur desktop
    } else {
      isSidebarOpen.value = false // false = caché sur mobile
    }
  }

  // Toggle spécifique pour mobile overlay
  const toggleMobileSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  // Initialisation
  const initializeLayout = () => {
    updateScreenSize()

    // Configuration initiale
    if (isMobileOrTablet.value) {
      isExtended.value = true // Fermé par défaut sur mobile/tablet
      isSidebarOpen.value = false
    }

    // Écouter les changements de taille
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', updateScreenSize)
    }
  }

  // Nettoyage
  const destroyLayout = () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateScreenSize)
    }
  }

  // Auto-initialisation côté client
  if (typeof window !== 'undefined') {
    initializeLayout()
  }

  return {
    // États (readonly pour éviter les mutations directes)
    isExtended: readonly(isExtended),
    isSidebarOpen: readonly(isSidebarOpen),
    screenSize: readonly(screenSize),
    previousDesktopState: readonly(previousDesktopState),

    // États calculés
    isMobile,
    isTablet,
    isDesktop,
    isMobileOrTablet,
    shouldShowSidebar,

    // Actions
    toggleExtend,
    setSidebarState,
    openSidebar,
    closeSidebar,
    toggleMobileSidebar,
    updateScreenSize,
    initializeLayout,
    destroyLayout,
  }
})
