import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { defineNuxtPlugin } from 'nuxt/app';

export default defineNuxtPlugin(() => {
  const firebaseConfig = {
    apiKey: 'AIzaSyBuy4keVchITi7Mtp2UR9_U5wuFvjLZPo4',
    authDomain: 'nuxt-project-e91d1.firebaseapp.com',
    databaseURL:
      'https://nuxt-project-e91d1-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'nuxt-project-e91d1',
    storageBucket: 'nuxt-project-e91d1.appspot.com',
    messagingSenderId: '247540307495',
    appId: '1:247540307495:web:fb594fc7be2a064a42e002',
    measurementId: 'G-4P5TCP42SV',
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);

  return {
    provide: {
      auth: auth,
    },
  };
});
