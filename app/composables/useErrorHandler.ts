// composables/useErrorHandler.ts
export function useErrorHandler(context = 'Unknown') {
  const toast = useToast()

  const handleError = (
    err: unknown,
    options?: { silent?: boolean; rethrow?: boolean }
  ) => {
    let message = 'An unknown error occurred.'

    if (err instanceof Error) {
      message = err.message
    } else if (typeof err === 'string') {
      message = err
    } else if ((err as Record<string, unknown>)?.message) {
      message = (err as Record<string, unknown>).message as string
    }

    if (!options?.silent) {
      console.error(`[Error:${context}]`, message)

      toast.add({
        title: `Error in ${context}`,
        description: message,
        color: 'red',
        timeout: 5000,
      })
    }

    if (options?.rethrow) {
      throw err
    }

    return message
  }

  return { handleError }
}
