export const useAnswerCallerProfile = defineStore(
    'answer-caller',
    () => {
      const answerCallerProfile = ref<TProfile>();
      const updateAnswerCallerProfile = (payload: TProfile) => {
        answerCallerProfile.value = payload;
      };
  
      return { answerCallerProfile, updateAnswerCallerProfile };
    },
    {
      persist: {
        storage: persistedState.localStorage,
      },
    },
  );
  