<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { Notifications } from '@/types/inbox'

const props = defineProps<{
  formData: Partial<Notifications>
  editItem: Notifications | null
}>()

const emit = defineEmits(['close-modal', 'submit-modal'])

const form = reactive<Partial<Notifications>>({
  title: '',
  description: '',
  time: '',
  isReaded: false,
  icon: 'uil:bell',
  color: '#6b7280',
  assignee: '',
  status: 'info',
  url: ''
})

// Synchroniser les props avec le formulaire local
watch(() => props.formData, (newVal) => {
  Object.assign(form, newVal)
}, { immediate: true })

const submit = () => {
  emit('submit-modal', form)
}
</script>
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
    <div class="bg-gray-900 rounded-md p-4 w-full max-w-lg">
      <h3 class="text-lg font-semibold mb-3">{{ editItem ? 'Modifier notification' : 'Créer notification' }}</h3>
      <div class="grid grid-cols-1 gap-2">
        <input v-model="form.title" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="Titre" />
        <input v-model="form.description" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="Description" />
        <div class="grid grid-cols-2 gap-2">
          <input v-model="form.time" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="time (ex: 2h, 3d)" />
          <input v-model="form.assignee" class="p-2 bg-gray-800 border border-gray-700 rounded" placeholder="assignee" />
        </div>
        <div class="flex items-center gap-2">
          <input v-model="form.icon" class="p-2 bg-gray-800 border border-gray-700 rounded flex-1" placeholder="icon (uil:...)" />
          <input v-model="form.color" class="p-2 bg-gray-800 border border-gray-700 rounded w-32" placeholder="#hex" />
        </div>
        <div class="flex items-center gap-2">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="form.isReaded" />
            <span class="text-sm text-gray-300">Lu</span>
          </label>
          <select v-model="form.status" class="p-2 bg-gray-800 border border-gray-700 rounded text-sm">
            <option value="info">info</option>
            <option value="warning">warning</option>
            <option value="completed">completed</option>
            <option value="error">error</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end gap-2">
        <button class="px-3 py-1 rounded hover:bg-gray-800" @click="$emit('close-modal')">Annuler</button>
        <button class="px-3 py-1 rounded bg-orange-600" @click="submit">{{ editItem ? 'Enregistrer' : 'Créer' }}</button>
      </div>
    </div>
  </div>
</template>