export const useRequestList = defineStore(
  'request-list',
  () => {
    const requestList = ref<TProfile[]>([]);
    const updateRequestList = (payload: TProfile[]) => {
      requestList.value = payload;
    };

    const denyRequest = (id: string) => {
      const indexUser = requestList.value.findIndex((user) => user.id === id);
      if (indexUser !== -1) {
        requestList.value.splice(indexUser, 1);
      }
    };

    return { requestList, updateRequestList, denyRequest };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
