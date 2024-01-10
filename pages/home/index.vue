<template>
  <MainLayout />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import MainLayout from "~/layouts/home/main-layout.vue";
const { $firebaseStore } = useNuxtApp();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const navigatorTabStore = useNavigatorTabStore();

const getUserDatabase = async () => {
  const userList = await getDoc(doc($firebaseStore, "users", "user_system"));
  const { list_user } = userList.data()!;
  const userDetail: TProfile = list_user.find(
    (user: TProfile) => user.id === authStore.token?.localId
  );
  profileStore.updateProfile(userDetail);
};

watchEffect(() => {
  getUserDatabase();
  navigatorTabStore.changeNavigatorTab("default");
});
</script>

<style lang="scss" scoped></style>
