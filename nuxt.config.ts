import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@formkit/auto-animate/nuxt",
    "nuxt-gtag",
  ],

  gtag: {
    enabled: !process.env.DEV,
    id: "G-D6V76T469N",
  },

  site: {
    url: "https://uqucc.sb.sa",
    github: "https://github.com/Saad5400/uqucc/tree/nuxt",
    name: "دليل طالب كلية الحاسبات",
  },

  content: {
    preview: {
      api: "https://api.nuxt.studio",
    },
  },

  colorMode: {
    classSuffix: "",
    preference: "dark",
  },

  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },

  css: ["~/assets/css/tailwind.css", "~/assets/css/typography.css"],

  vite: {
    plugins: [tailwindcss()],
  },
});
