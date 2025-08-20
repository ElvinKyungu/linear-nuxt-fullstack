<script setup lang="ts">
import { useGsapModal } from '@/composables/useGsapModal'

const props = defineProps<{
  modelValue: boolean
  position: { top: number; left: number }
}>()
const emit = defineEmits(['update:modelValue', 'set-theme'])

const modal = ref<HTMLElement | null>(null)
const { showModal, hideModal } = useGsapModal()

watch(
  () => props.modelValue,
  (val) => {
    console.log('modelValue changed:', val)
    if (val && modal.value) showModal(modal.value)
  }
)

const close = () => {
  if (modal.value) hideModal(modal.value, () => emit('update:modelValue', false))
}

const themes = [
  { name: 'light', icon: 'uil:sun' },
  { name: 'dark', icon: 'uil:moon' },
  { name: 'system', icon: 'uil:desktop' },
  { name: 'ghibli', icon: 'uil:film' },
]

const chooseTheme = (theme: string) => {
  emit('set-theme', theme)
  close()
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed z-[100]"
      :style="{
        top: `${props.position.top}px`,
        left: `${props.position.left}px`,
        position: 'fixed',
      }"
    >
      <div
        ref="modal"
        class="bg-white dark:bg-gray-900 text-black dark:text-white rounded-xl shadow-lg p-4 w-[200px] space-y-2"
      >
        <p class="text-left font-semibold mb-2">Choisis un thème</p>
        <ul class="flex flex-col justify-start gap-2">
          <li v-for="theme in themes" :key="theme.name">
            <UButton :icon="theme.icon" variant="ghost" block @click="chooseTheme(theme.name)">
              {{ theme.name }}
            </UButton>
          </li>
        </ul>
      </div>
    </div>
  </Teleport>
</template>
