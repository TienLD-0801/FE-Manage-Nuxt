type TNavigatorTab = {
  tab: string;
  group?: TMessageGroup;
};

const INIT_NAVIGATOR_TAB = {
  tab: 'default',
};

export const useNavigatorTabStore = defineStore(
  'navigator-tab',
  () => {
    const currentTab = ref<TNavigatorTab>(INIT_NAVIGATOR_TAB);
    const changeNavigatorTab = (payload: {
      tab: string;
      group?: TMessageGroup;
    }) => {
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
