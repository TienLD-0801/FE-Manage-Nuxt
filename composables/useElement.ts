export const useElement = () => {
  const scrollElementId = 'el-scroll-id';
  const inputElementId = 'el-input-id';

  // handle scroll
  const onSetScroll = (
    scrollTop: number,
    type: 'auto' | 'instant' | 'smooth',
  ): void => {
    const element = document.getElementById(scrollElementId);
    if (element) {
      element.scrollTo({ top: scrollTop, behavior: type });
    }
  };

  // handle open file window
  const onOpenFile = (): void => {
    const element: HTMLElement | null = document.getElementById(inputElementId);
    if (element) {
      element.click();
    }
  };

  return {
    onSetScroll,
    scrollElementId,
    inputElementId,
    onOpenFile,
  };
};
