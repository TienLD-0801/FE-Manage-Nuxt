export const useCounterStore = defineStore(
  'counter',
  () => {
    const number = ref(0);
    const increment = () => {
      number.value++;
    };
    const decrement = () => {
      number.value--;
    };
    return { number, increment, decrement };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  },
);
