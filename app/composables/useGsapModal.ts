// composables/useGsapModal.ts
import gsap from 'gsap'

export function useGsapModal() {
  const showModal = (el: HTMLElement) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
    )
  }

  const hideModal = (el: HTMLElement, callback?: () => void) => {
    gsap.to(el, {
      opacity: 0,
      y: 50,
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: callback,
    })
  }

  return { showModal, hideModal }
}
