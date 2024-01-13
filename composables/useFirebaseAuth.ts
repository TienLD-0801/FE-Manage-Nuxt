import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { CustomError } from '~/shared/Error/error';
import { FIRESTORE_PATH } from '~/shared/constant/firebase-store';

export const useFirebaseAuth = () => {
  const { $firebaseAuth, $firestore } = useNuxtApp();

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
      console.log('Logout successfully');
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
      $firestore,
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

  const updateChatInfo = async (
    senderId: string,
    receiverId: string,
    profile: TProfile,
  ) => {
    const isSender = senderId === profile.id;
    const isReceiver = receiverId === profile.id;
    if (isSender || isReceiver) {
      const fieldToUpdate = isSender ? 'sender' : 'receiver';
      const groupId = `${senderId}-${receiverId}`;
      try {
        await updateDoc(
          doc($firestore, FIRESTORE_PATH.chat_collection, groupId),
          {
            [fieldToUpdate]: profile,
          },
        );
        console.log('Update chat info successfully');
      } catch (error) {
        console.error('Error update chat info ', error);
      }
    }
  };

  return {
    updateChatInfo,
    register,
    login,
    logout,
    addUsersFirebaseStore,
  };
};
