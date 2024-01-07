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
  ],
  build: {
    transpile: ['vuetify'],
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'build'),
    },
  },
});
