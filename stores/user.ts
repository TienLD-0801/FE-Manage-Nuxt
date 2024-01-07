export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref({
      id: '',
    });
    const updateUser = (payload: {
      id: string;
      userName: string;
      metaData: Object;
      avatar: string | null;
    }) => {
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
