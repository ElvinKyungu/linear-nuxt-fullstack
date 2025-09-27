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
    // Pas de modules d'authentification
    '@nuxt/scripts',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json',
        flag: 'gb'
      },
      {
        code: 'fr',
        iso: 'fr-FR',
        name: 'Français',
        file: 'fr.json',
        flag: 'fr'
      }
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales/',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'fr'
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'fallback-secret-key-for-demo',
    public: {
      // Variables publiques
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  nitro: {
    preset: 'cloudflare-pages',
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/Icons',
      prefix: 'Icons',
    },
  ],
  devServer: {
    port: 3000,
  }
})