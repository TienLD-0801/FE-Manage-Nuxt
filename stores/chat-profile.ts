export const useChatProfileStore = defineStore(
  'chat-profile',
  () => {
    const chatProfile = ref<ProfileType>();
    const updateChatInfo = (payload: ProfileType) => {
      chatProfile.value = payload;
    };

    return { chatProfile, updateChatInfo };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
