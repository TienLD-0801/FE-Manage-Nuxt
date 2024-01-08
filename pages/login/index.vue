<template>
  <Snackbar :model-value="Boolean(message)" :message="message" />
  <Loading :is-loading="isLoading" />
  <div class="login-page-container">
    <LoginForm @handleLogin="handleLogin" />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "auth-guard",
});
import { CustomError } from "~/shared/Error/error";
import { PATH_ROUTER } from "~/shared/constant/router";

const { login } = useFirebaseAuth();
const isLoading = useState<boolean>("isLoading", () => false);
const message = useState<string>("message", () => "");

const handleLogin = async (user: { email: string; password: string }) => {
  // reset value
  message.value = "";
  isLoading.value = true;
  try {
    await login(user.email, user.password);
    navigateTo(PATH_ROUTER.home);
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
