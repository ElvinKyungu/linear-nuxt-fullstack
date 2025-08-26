// nuxt.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@vueuse/nuxt',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@pinia/nuxt',
    '@nuxt/content',
    '@nuxt/scripts',
    // Pas de modules d'authentification
  ],
  runtimeConfig: {
    public: {
      // Variables publiques
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    preset: "cloudflare"
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/icons',
      prefix: 'Icons',
    },
  ],
})