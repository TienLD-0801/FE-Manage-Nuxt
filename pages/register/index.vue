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
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

const { register, addUsersFirebaseStore } = useFirebaseAuth();
const isLoading = useState<boolean>("isLoading", () => false);
const message = useState<string>("message", () => "");
const { $firebaseStore } = useNuxtApp();

const handleRegister = async (data: ProfileType) => {
  // reset value
  message.value = "";
  isLoading.value = true;
  try {
    const user = await register(data.email, data.password!);
    const dataUser = {
      id: user?.uid,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      avatar:
        "https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png",
      created_at: new Date().getTime(),
    };
    await addUsersFirebaseStore(dataUser);
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
