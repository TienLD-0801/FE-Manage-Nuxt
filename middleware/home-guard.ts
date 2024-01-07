import { PATH_ROUTER } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = true;
  if (!isLogin) {
    return navigateTo(PATH_ROUTER.login);
  }
});
