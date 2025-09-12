import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useInboxResize() {
  const sidebarWidth = ref<number>(320)
  const isResizing = ref<boolean>(false)
  const containerWidth = ref<number>(0)

  const updateContainerWidth = () => {
    containerWidth.value = window.innerWidth
  }

  const mainContentWidth = computed(() =>
    Math.max(0, containerWidth.value - sidebarWidth.value - 1)
  )

  const startResize = (e: MouseEvent) => {
    isResizing.value = true
    const startX = e.clientX
    const startSidebarWidth = sidebarWidth.value

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizing.value) return
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(
        48,
        Math.min(containerWidth.value - 100, startSidebarWidth + deltaX)
      )
      sidebarWidth.value = newWidth
    }

    const handleMouseUp = () => {
      isResizing.value = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    e.preventDefault()
  }

  onMounted(() => {
    updateContainerWidth()
    window.addEventListener('resize', updateContainerWidth)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', updateContainerWidth)
  })

  return {
    sidebarWidth,
    isResizing,
    mainContentWidth,
    startResize,
  }
}
