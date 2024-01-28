import { PATH_ROUTER } from '~/shared/constant/router';

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore();
  const isLogin = authStore.$state.token;
  if (!isLogin) {
    return navigateTo(PATH_ROUTER.login);
  }
});
