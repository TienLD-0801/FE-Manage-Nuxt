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

export const useAuthStore = defineStore(
  'auth',
  () => {
    const token = ref<TokenResponse | undefined>();
    const saveToken = (payload: TokenResponse) => {
      token.value = payload;
    };

    const clearToken = () => {
      token.value = undefined;
    };

    return { token, saveToken, clearToken };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
