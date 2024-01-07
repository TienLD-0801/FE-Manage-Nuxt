import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth,
} from 'firebase/auth';
import { PATH_ROUTER } from '~/shared/constant/router';

export const useFirebaseAuth = () => {
  const { $auth } = useNuxtApp();
  const userStore = useUserStore();

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $auth,
        email,
        password,
      );
      const user = userCredential.user;

      console.log(user);
    } catch (error) {
      console.log(error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        $auth,
        email,
        password,
      );

      const user = userCredential.user;
      userStore.updateUser({
        id: user.uid,
        userName: user.email!,
        metaData: user.metadata,
        avatar: user.photoURL,
      });
      navigateTo(PATH_ROUTER.home);
      console.log('firebase', user);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    register,
    login,
  };
};
