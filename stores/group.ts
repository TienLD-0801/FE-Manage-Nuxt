export const useGroupStore = defineStore(
    'group',
    () => {
      const group = ref<TMessageGroup>();
      const updateGroup = (payload: TMessageGroup) => {
        group.value = payload;
      };
  
      return { group, updateGroup };
    },
    {
      persist: {
        storage: persistedState.localStorage,
      },
    },
  );
  