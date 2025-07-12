import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@formkit/auto-animate/nuxt',
  ],

  site: {
    url: 'http://uqucc.sb.sa',
    name: 'دليل طالب كلية الحاسبات',
  },

  colorMode: {
    classSuffix: '',
    preference: 'dark',
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  css: [
    '~/assets/css/tailwind.css',
    '~/assets/css/typography.css',
  ],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})