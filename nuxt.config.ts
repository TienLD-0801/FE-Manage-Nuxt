const path = require('path');
export default defineNuxtConfig({
  app: {
    head: {
      title: 'MyApp',
      meta: [{ name: 'description', content: 'My amazing site.' }],
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devServer: {
    port: 1102,
  },
  devtools: { enabled: false },
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
    '~/assets/scss/main.scss',
  ],
  build: {
    transpile: ['vuetify'],
  },
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt'],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  ssr: false,
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'build'),
    },
  },
});
