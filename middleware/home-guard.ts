import { ROUTER_PATH } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  const isLogin = userStore.$state.user.id;
  if (!isLogin) {
    return navigateTo(ROUTER_PATH.login);
  }
});
