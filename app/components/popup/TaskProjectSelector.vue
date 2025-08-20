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
const search = ref('')
const isOpen = ref(false)

const priorities = [
  { id: 0, name: 'No Project', icon: 'uil:folder', count: 3 },
  { id: 1, name: 'Navigation', icon: 'uil:bolt-alt', count: 11 },
  { id: 2, name: 'Dropdown', icon: 'uil:signal-alt-3', count: 10 },
  { id: 3, name: 'Modals', icon: 'uil:signal-alt', count: 6 },
  { id: 4, name: 'Sidebar', icon: 'uil:signal-alt', count: 0 },
  { id: 5, name: 'Tooltip', icon: 'uil:signal-alt', count: 0 },
  { id: 6, name: 'Theming', icon: 'uil:signal-alt', count: 0 },
  { id: 7, name: 'Core Components', icon: 'uil:signal-alt', count: 0 },
  { id: 8, name: 'Data Table', icon: 'uil:signal-alt', count: 0 },
  { id: 9, name: 'Cards', icon: 'uil:signal-alt', count: 0 },
  { id: 10, name: 'API', icon: 'uil:signal-alt', count: 0 },
]

const selected = ref(priorities[1])

const filtered = computed(() =>
  priorities.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()))
)

const selectLevel = (level: any) => {
  selected.value = level
  gsap.to(popup.value, {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.in',
    onComplete: () => {
      emit('update:modelValue', level)
      emit('close')
    },
  })
}

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
    class="absolute items-center gap-2 text-white bg-primary border border-b border-bordercolor rounded-lg shadow-lg p-3 z-[999] w-[18rem] top-10"
  >
    <div class="flex flex-col gap-2 mb-3">
      <h2 class="text-sm font-medium">Task Level</h2>
      <UInput
        v-model="search"
        trailing-icon="uil:search"
        placeholder="Search priority..."
        size="md"
        class="text-sm"
      />
    </div>

    <div class="space-y-1 max-h-64 overflow-y-auto">
      <button
        v-for="item in filtered"
        :key="item.id"
        class="w-full flex items-center justify-between px-2 py-1.5 rounded hover:bg-gray-800 cursor-pointer text-sm transition"
        @click="selectLevel(item)"
      >
        <div class="flex items-center gap-3">
          <UIcon :name="item.icon" class="w-4 h-4" size="16" />
          <span>Elvin UI - {{ item.name }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-gray-500">{{ item.count }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
