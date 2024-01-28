import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  const { firebaseConfig } = config.public;
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getFirestore(app);

  return {
    provide: {
      firebaseApp: app,
      firebaseAuth: auth,
      firestore: database,
    },
  };
});
