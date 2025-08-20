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

const priorityMap = [
  { id: 0, name: 'No priority', icon: resolveComponent('IconNoPriority') },
  { id: 1, name: 'Urgent', icon: resolveComponent('IconUrgent') },
  { id: 2, name: 'High', icon: resolveComponent('IconHigh') },
  { id: 3, name: 'Medium', icon: resolveComponent('IconMedium') },
  { id: 4, name: 'Low', icon: resolveComponent('IconLow') },
]

const filtered = computed(() =>
  priorityMap.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase()))
)
const selectLevel = (level: any) => {
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
    class="absolute items-center gap-2 bg-primary border border-bordercolor text-white rounded-lg shadow-lg p-3 z-[999] w-64 top-10"
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
        class="w-full flex items-center justify-between px-2 py-1rounded hover:bg-gray-800 cursor-pointer text-sm transition"
        @click="selectLevel(item)"
      >
        <div class="flex items-center gap-3">
          <UButton variant="ghost" class="cursor-pointer">
            <component :is="item.icon" />
          </UButton>
          <span>{{ item.name }}</span>
        </div>
        <div class="flex items-center gap-1">
          <span class="text-xs text-gray-500">{{ item.id }}</span>
        </div>
      </button>
    </div>
  </div>
</template>
