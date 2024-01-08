<template>
  <Loading :is-loading="isLoading" />
  <v-card>
    <v-layout>
      <NavigatorDrawer>
        <SettingList @handleLogout="handleLogout" />
      </NavigatorDrawer>
      <BodyTab />
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
import { PATH_ROUTER } from "~/shared/constant/router";
const userStore = useUserStore();
const { logout } = useFirebaseAuth();
const isLoading = useState<boolean>("isLoading", () => false);
const handleLogout = async () => {
  isLoading.value = true;
  try {
    await logout();
    userStore.clearUser();
    navigateTo(PATH_ROUTER.login);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped></style>
