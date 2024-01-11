export const useScroll = () => {
  const setScroll = (
    elementId: string,
    scrollTop: number,
    type: 'auto' | 'instant' | 'smooth',
  ) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollTo({ top: scrollTop, behavior: type });
    }
  };

  return {
    setScroll,
  };
};
