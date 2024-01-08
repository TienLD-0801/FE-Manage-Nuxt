import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(() => {
  const { $config } = useNuxtApp();
  const firebaseConfig = {
    apiKey: $config.public.apiKey,
    authDomain: $config.public.authDomain,
    databaseURL: $config.public.databaseURL,
    projectId: $config.public.projectId,
    storageBucket: $config.public.storageBucket,
    messagingSenderId: $config.public.messagingSenderId,
    appId: $config.public.appId,
    measurementId: $config.public.measurementId,
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  return {
    provide: {
      auth: auth,
    },
  };
});
