// nuxt.config.ts
export default defineNuxtConfig({
  css: ["@/assets/styles/main.scss"],
  build: {
    transpile: [],
  },
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    rootId: 'nuxt'
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000/api'
    }
  },
});