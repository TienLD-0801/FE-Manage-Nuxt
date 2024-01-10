import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { set, ref, push, onValue, get, child, update } from 'firebase/database';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { CustomError } from '~/shared/Error/error';

export const useFirebaseAuth = () => {
  const { $firebaseAuth, $firebaseStore, $firebaseRealtime } = useNuxtApp();

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        $firebaseAuth,
        email,
        password,
      );
      return userCredential.user;
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

  const login = async (
    email: string,
    password: string,
  ): Promise<UserCredentialCustom | undefined> => {
    try {
      const userCredential: UserCredentialCustom =
        await signInWithEmailAndPassword($firebaseAuth, email, password);
      return userCredential;
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
      await signOut($firebaseAuth);
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

  const addUsersFirebaseStore = async (dataUser: any) => {
    const docUser = doc($firebaseStore, 'users', 'user_system');
    try {
      await updateDoc(docUser, {
        list_user: arrayUnion(dataUser),
      });
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

  const writeRealtimeDatabase = async (key: string, data: any) => {
    await update(ref($firebaseRealtime, `chats/${key}`), data);
  };

  const readRealtimeDatabase = () => {
    return ref($firebaseRealtime, `chats`);
  };

  return {
    register,
    login,
    logout,
    writeRealtimeDatabase,
    addUsersFirebaseStore,
    readRealtimeDatabase,
  };
};
