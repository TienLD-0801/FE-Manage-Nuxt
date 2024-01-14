import { DEFAULT_AVATAR } from '~/shared/constant/constant';

export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<TProfile>({
      id: '',
      email: '',
      lastName: '',
      avatar: DEFAULT_AVATAR,
      firstName: '',
      created_at: '',
      updated_at: '',
    });
    const updateProfile = (payload: TProfile) => {
      profile.value = payload;
    };

    return { profile, updateProfile };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
