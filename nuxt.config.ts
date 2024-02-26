const path = require('path');
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Chatty App',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [{ name: 'description', content: 'Chatty app amazing' }],
      link: [
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/chat.ico',
          sizes: '180x180',
        },
      ],
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
  modules: [
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@nuxtjs/robots',
  ],
  piniaPersistedstate: {
    cookieOptions: {
      sameSite: 'strict',
    },
    storage: 'localStorage',
  },
  nitro: {
    output: {
      publicDir: path.join(__dirname, 'build'),
    },
  },
  ssr: false,
  runtimeConfig: {
    public: {
      firebaseConfig: {
        apiKey: process.env.API_KEY,
        authDomain: process.env.AUTH_DOMAIN,
        projectId: process.env.PROJECT_ID,
        storageBucket: process.env.STORAGE_BUCKET,
        messagingSenderId: process.env.MESSAGING_SENDER_ID,
        appId: process.env.APP_ID,
        measurementId: process.env.MEASUREMENT_ID,
      },
      cloudinaryConfig: {
        apiKey: process.env.CLOUD_API_KEY,
        cloudName: process.env.CLOUD_NAME,
        uploadPreset: process.env.UPLOAD_PRESET,
      },
    },
  },
});
