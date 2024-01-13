export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<TProfile>({
      id: '',
      email: '',
      lastName: '',
      avatar: '',
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
