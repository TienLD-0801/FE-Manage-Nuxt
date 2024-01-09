export const useProfileStore = defineStore(
  'profile',
  () => {
    const profile = ref<ProfileType>();
    const updateProfile = (payload: ProfileType) => {
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
