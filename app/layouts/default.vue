<script setup lang="ts">
import gsap from 'gsap'

const layoutStore = useLayoutStore()
const sidebarWrapRef = ref<HTMLElement | null>(null)

watch(
  () => layoutStore.isExtended,
  (extended) => {
    const wrap = sidebarWrapRef.value
    const aside = wrap?.querySelector('aside') as HTMLElement | null
    if (!wrap || !aside) return

    if (extended) {
      // Fermer sidebar
      gsap
        .timeline()
        .to(aside, { x: '-100%', duration: 0.3, ease: 'power2.inOut' }, 0)
        .to(wrap, { width: 0, duration: 0.35, ease: 'power2.inOut' }, 0)
    } else {
      // Réouvrir sidebar
      gsap
        .timeline()
        .to(wrap, { width: '20rem', duration: 0.35, ease: 'power2.inOut' }, 0)
        .to(aside, { x: '0%', duration: 0.3, ease: 'power2.inOut' }, 0)
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="flex h-screen overflow-hidden bg-primary">
    <!-- Sidebar -->
    <div ref="sidebarWrapRef" class="w-80 shrink-0 overflow-hidden">
      <SidebarArea />
    </div>
    <div
      class="relative flex flex-1 flex-col overflow-hidden border border-bordercolor m-2 rounded-xl"
    >
      <header class="shrink-0">
        <HeaderArea />
      </header>

      <!-- Contenu scrollable -->
      <main class="flex-1 overflow-y-auto bg-primary">
        <div class="mx-auto max-w-screen-4xl p-1 md:p-2 2xl:p-3">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
