import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  arrayUnion,
  collection,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { CustomError } from '~/shared/Error/error';
import { FIRESTORE_PATH } from '~/shared/constant/firebase-store';

export const useFirebaseAuth = () => {
  const { $firebaseAuth, $firebaseStore } = useNuxtApp();

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

  const addUsersFirebaseStore = async (dataUser: TProfile) => {
    const docUser = doc(
      $firebaseStore,
      FIRESTORE_PATH.user_collection,
      dataUser.id,
    );
    try {
      await setDoc(docUser, dataUser);
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
    addUsersFirebaseStore,
  };
};
