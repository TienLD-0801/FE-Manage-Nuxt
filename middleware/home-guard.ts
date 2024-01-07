import { PATH_ROUTER } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const isLogin = userStore.$state.user.id;
  if (!isLogin) {
    return navigateTo(PATH_ROUTER.login);
  }
});
