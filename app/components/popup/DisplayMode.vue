<script setup lang="ts">
import { gsap } from 'gsap'

defineProps({
  triggerElement: {
    type: Object as PropType<{ $el: HTMLElement }>,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'close'])

const popup = ref<HTMLElement | null>(null)
const isOpen = ref(false)

onMounted(() => {
  isOpen.value = true
  gsap.from(popup.value, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.out',
  })
})

onClickOutside(popup, () => {
  emit('close')
})
</script>

<template>
  <div
    ref="popup"
    class="absolute items-center gap-2 text-white bg-primary border border-b border-bordercolor rounded-lg shadow-lg p-2 z-[999] w-[15rem] top-10 right-0"
  >
    <div class="grid grid-cols-2 items-center gap-2 w-full justify-between">
      <UButton
        class="text-gray-400 flex flex-col bg-gray-400/20 justify-center hover:text-white col-span-1"
        variant="ghost"
        @click="
          emit('update:modelValue', 'grid');
          emit('close');
        "
      >
        <UIcon name="uil:grid" class="text-2xl cursor-pointer text-gray-400" />
        <span class="text-sm text-white">Grid</span>
      </UButton>
      <UButton
        class="text-gray-400 flex flex-col justify-center bg-gray-400/20 hover:text-white col-span-1"
        variant=""
        @click="
          emit('update:modelValue', 'list');
          emit('close');
        "
      >
        <UIcon name="uil:list-ul" class="text-2xl cursor-pointer text-gray-400" />
        <span class="text-sm text-white">List</span>
      </UButton>
    </div>
  </div>
</template>
