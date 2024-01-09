export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<TProfile>();
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
