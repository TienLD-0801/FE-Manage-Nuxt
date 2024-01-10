export const useRequestUserStore = defineStore(
  'request-user',
  () => {
    const requestUser = ref<TMessageGroup[]>();
    const updateRequestUser = (payload: TMessageGroup[]) => {
      requestUser.value = payload;
    };

    return { requestUser, updateRequestUser };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
