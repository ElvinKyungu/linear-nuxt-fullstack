// composables/useInboxToast.ts
export const useInboxToast = () => {
  const toast = useToast()

  const showSuccess = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'i-heroicons-check-circle',
      color: 'green',
      timeout: 3000,
    })
  }

  const showError = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'i-heroicons-x-circle',
      color: 'red',
      timeout: 5000,
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'i-heroicons-exclamation-triangle',
      color: 'yellow',
      timeout: 4000,
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast.add({
      title,
      description,
      icon: 'i-heroicons-information-circle',
      color: 'blue',
      timeout: 3000,
    })
  }

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
}
