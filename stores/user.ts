import type { UserCredential } from 'firebase/auth';

export type TokenResponse = {
  displayName: string;
  email: string;
  expiresIn: string;
  idToken: string;
  kind: string;
  localId: string;
  refreshToken: string;
  registered: boolean;
};

export interface UserCredentialCustom extends UserCredential {
  _tokenResponse?: TokenResponse;
}

export const INIT_USER: TokenResponse | undefined = undefined;

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<TokenResponse | undefined>(INIT_USER);
    const updateUser = (payload: TokenResponse) => {
      user.value = payload;
    };

    const clearUser = () => {
      user.value = undefined;
    };

    return { user, updateUser, clearUser };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
