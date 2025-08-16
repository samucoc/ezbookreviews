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
});