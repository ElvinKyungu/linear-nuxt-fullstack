import { gsap } from 'gsap'

export function usePopupAnimation(
  popupRef: Ref<HTMLElement | null>,
  onClose: () => void
) {
  const isOpen = ref(false)

  const openPopup = () => {
    isOpen.value = true
    nextTick(() => {
      if (popupRef.value) {
        gsap.fromTo(
          popupRef.value,
          { opacity: 0, scale: 0.95, y: -20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        )
      }
    })
  }

  const closePopup = () => {
    if (popupRef.value) {
      gsap.to(popupRef.value, {
        opacity: 0,
        scale: 0.95,
        y: -20,
        duration: 0.2,
        ease: 'power2.in',
        onComplete: () => {
          isOpen.value = false
          onClose()
        },
      })
    }
  }

  // 👇 Gestion uniquement de ESC dans le composable
  useEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen.value) closePopup()
  })

  return { isOpen, openPopup, closePopup }
}
