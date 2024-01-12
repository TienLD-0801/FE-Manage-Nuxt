<template>
  <Snackbar :model-value="Boolean(alertText)" :alertText="alertText" />
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

const { register, addUsersFirebaseStore } = useFirebaseAuth();
const isLoading = ref<boolean>(false);
const alertText = ref("");

const handleRegister = async (dataForm: TRegisterInfo) => {
  // reset value
  alertText.value = "";
  isLoading.value = true;
  try {
    const user = await register(dataForm.email, dataForm.password);
    const dataUser: TProfile = {
      id: user?.uid!,
      firstName: dataForm.firstName,
      lastName: dataForm.lastName,
      email: dataForm.email,
      avatar:
        "https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png",
      created_at: new Date().toString(),
    };
    await addUsersFirebaseStore(dataUser);
    navigateTo(PATH_ROUTER.login);
  } catch (error) {
    if (error instanceof CustomError) {
      alertText.value = error.code;
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
