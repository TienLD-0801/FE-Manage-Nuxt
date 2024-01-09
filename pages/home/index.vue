<template>
  <MainLayout />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
const { $db } = useNuxtApp();
import { collection, addDoc, doc, getDoc } from "firebase/firestore";
import MainLayout from "~/layouts/home/main-layout.vue";

//const messageList =  $db.collection("messages").doc("users");
const { $firebaseStore } = useNuxtApp();
const profileStore = useProfileStore();
const authStore = useAuthStore();

const getUserDatabase = async () => {
  const userList = await getDoc(doc($firebaseStore, "users", "user_system"));
  const { list_user } = userList.data()!;
  const userDetail: ProfileType = list_user.find(
    (user: ProfileType) => user.id === authStore.token?.localId
  );
  profileStore.updateProfile(userDetail);
};

watchEffect(() => {
  getUserDatabase();
});
</script>

<style lang="scss" scoped></style>
