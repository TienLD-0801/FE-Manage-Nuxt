<template>
  <MainLayout />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
import { doc, getDoc } from "firebase/firestore";
import MainLayout from "~/layouts/home/main-layout.vue";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $firebaseStore } = useNuxtApp();
const profileStore = useProfileStore();
const authStore = useAuthStore();
const navigatorTabStore = useNavigatorTabStore();

const getUserDatabase = async () => {
  const userInfo = await getDoc(
    doc($firebaseStore, FIRESTORE_PATH.user_collection, authStore.token?.localId!)
  );
  profileStore.updateProfile(userInfo.data() as TProfile);
};

watchEffect(() => {
  getUserDatabase();
  navigatorTabStore.changeNavigatorTab({ tab: "default" });
});
</script>

<style lang="scss" scoped></style>
