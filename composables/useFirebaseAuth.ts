import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { CustomError } from '~/shared/Error/error';

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
      const userCredential: UserCredentialCustom =
        await signInWithEmailAndPassword($auth, email, password);

      userStore.updateUser(userCredential._tokenResponse!);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const customError = new CustomError(
          error.code,
          error.name,
          error.message,
        );
        throw customError;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut($auth);
      userStore.updateUser(INIT_USER);
    } catch (error) {
      if (error instanceof FirebaseError) {
        const customError = new CustomError(
          error.code,
          error.name,
          error.message,
        );
        throw customError;
      }
    }
  };

  return {
    register,
    login,
    logout,
  };
};
