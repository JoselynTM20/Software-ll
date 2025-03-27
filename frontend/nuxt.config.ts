// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@vueuse/nuxt'
  ],
  // @ts-ignore
  colorMode: {
    classSuffix: ''
  },
  i18n: {
    locales: ['es'],
    defaultLocale: 'es',
    vueI18n: './i18n.config.ts'
  },
  runtimeConfig: {
    public: {
      apiBase: 'http://localhost:3000/api'
    }
  },
  app: {
    head: {
      title: 'CineApp',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Catálogo de Películas' }
      ]
    }
  }
})
