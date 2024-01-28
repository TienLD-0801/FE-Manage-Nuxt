export const useChatProfileStore = defineStore(
  'chat-profile',
  () => {
    const chatProfile = ref<TProfile>();
    const updateChatInfo = (payload: TProfile) => {
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
