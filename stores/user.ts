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

export const INIT_USER: TokenResponse = {
  displayName: '',
  email: '',
  expiresIn: '',
  idToken: '',
  kind: '',
  localId: '',
  refreshToken: '',
  registered: false,
};

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<TokenResponse>(INIT_USER);
    const updateUser = (payload: TokenResponse) => {
      user.value = {
        ...payload,
      };
    };

    return { user, updateUser };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
