import { PATH_ROUTER } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const isLogin = userStore.$state.user;
  if (isLogin) {
    return navigateTo(PATH_ROUTER.home);
  }
});
