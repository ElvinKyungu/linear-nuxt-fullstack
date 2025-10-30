// composables/useInboxToast.ts
export const useInboxToast = () => {
  // Lazy initialization of toast to avoid SSR issues
  let toast: ReturnType<typeof useToast> | null = null

  const getToast = () => {
    if (import.meta.client && !toast) {
      toast = useToast()
    }
    return toast
  }

  const showSuccess = (title: string, description?: string) => {
    const toastInstance = getToast()
    if (toastInstance) {
      toastInstance.add({
        title,
        description,
        icon: 'i-heroicons-check-circle',
        color: 'green',
        timeout: 3000,
      })
    }
  }

  const showError = (title: string, description?: string) => {
    const toastInstance = getToast()
    if (toastInstance) {
      toastInstance.add({
        title,
        description,
        icon: 'i-heroicons-x-circle',
        color: 'red',
        timeout: 5000,
      })
    }
  }

  const showWarning = (title: string, description?: string) => {
    const toastInstance = getToast()
    if (toastInstance) {
      toastInstance.add({
        title,
        description,
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow',
        timeout: 4000,
      })
    }
  }

  const showInfo = (title: string, description?: string) => {
    const toastInstance = getToast()
    if (toastInstance) {
      toastInstance.add({
        title,
        description,
        icon: 'i-heroicons-information-circle',
        color: 'blue',
        timeout: 3000,
      })
    }
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
