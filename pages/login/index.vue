<template>
  <Snackbar :model-value="Boolean(message)" :alert-text="message" />
  <Loading :is-loading="isLoading" />
  <div class="login-page-container">
    <LoginForm @handleLogin="handleLogin" />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "auth-guard",
});
import { CustomError } from "~/shared/error/error";
import { PATH_ROUTER } from "~/shared/constant/router";

const { login } = useFirebaseAuth();
const isLoading = ref<boolean>(false);
const message = ref<string>("");
const authStore = useAuthStore();

const handleLogin = async (user: { email: string; password: string }) => {
  // reset value
  message.value = "";
  isLoading.value = true;
  try {
    const userCredential = await login(user.email, user.password);
    if (userCredential) {
      authStore.saveToken(userCredential._tokenResponse!);
      navigateTo(PATH_ROUTER.home);
    }
  } catch (error) {
    if (error instanceof CustomError) {
      message.value = error.code;
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("/imgs/bg-intro.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
