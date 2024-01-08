<template>
  <Snackbar :model-value="Boolean(message)" :message="message" />
  <Loading :is-loading="isLoading" />
  <div class="register-page-container">
    <RegisterForm @handleRegister="handleRegister" />
  </div>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "auth-guard",
});

import { CustomError } from "~/shared/Error/error";
import { PATH_ROUTER } from "~/shared/constant/router";

const { register } = useFirebaseAuth();
const isLoading = useState<boolean>("isLoading", () => false);
const message = useState<string>("message", () => "");

const handleRegister = async (data: any) => {
  // reset value
  message.value = "";
  isLoading.value = true;
  try {
    await register(data.email, data.password);
    navigateTo(PATH_ROUTER.login);
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
.register-page-container {
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
