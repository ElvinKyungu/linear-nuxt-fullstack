// plugins/components.client.ts
import ProfileModal from '~/components/popup/ProfileModal.vue'
import Tasks from '~/components/tasks/TempIndex.vue'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('ProfileModal', ProfileModal)
  nuxtApp.vueApp.component('Tasks', Tasks)
})