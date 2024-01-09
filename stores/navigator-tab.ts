const INIT_NAVIGATOR_TAB = 'default';

export const useNavigatorTabStore = defineStore(
  'navigator-tab',
  () => {
    const currentTab = ref(INIT_NAVIGATOR_TAB);
    const changeNavigatorTab = (payload: string) => {
      currentTab.value = payload;
    };

    return { changeNavigatorTab, currentTab };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
