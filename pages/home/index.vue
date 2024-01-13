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
const { $firestore } = useNuxtApp();
const { updateProfile } = useProfileStore();
const authStore = useAuthStore();
const navigatorTabStore = useNavigatorTabStore();

const getUserDatabase = async () => {
  const userInfo = await getDoc(
    doc($firestore, FIRESTORE_PATH.user_collection, authStore.token?.localId!)
  );
  updateProfile(userInfo.data() as TProfile);
};

watchEffect(() => {
  getUserDatabase();
  navigatorTabStore.changeNavigatorTab({ tab: "default" });
});
</script>

<style lang="scss" scoped></style>
