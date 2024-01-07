import { ROUTER_PATH } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const isLogin = false;
  if (!isLogin) {
    return navigateTo(ROUTER_PATH.login);
  }
});
