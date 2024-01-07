import { PATH_ROUTER } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = false;
  if (!isLogin) {
    return navigateTo(PATH_ROUTER.login);
  }
});
