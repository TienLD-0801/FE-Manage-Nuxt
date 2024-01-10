<template>
  <Loading :is-loading="isLoading" />
  <v-navigation-drawer class="navigator-drawer-container">
    <v-toolbar color="#e4e8eb" class="px-0">
      <v-icon class="icon-app" size="large" icon="mdi-snapchat" />
      <v-toolbar-title>Chat Nuxt</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
      <template v-slot:extension>
        <div class="tabs-main">
          <v-tabs v-model="tabs" color="primary" grow>
            <v-tab :value="chats">
              <v-icon>mdi-forum-outline</v-icon>
            </v-tab>

            <v-tab :value="friends">
              <v-icon>mdi-account-multiple-outline</v-icon>
            </v-tab>

            <v-tab :value="settings">
              <v-icon>mdi-cog-outline</v-icon>
            </v-tab>
          </v-tabs>
        </div>
      </template>
    </v-toolbar>

    <v-window v-model="tabs">
      <v-window-item id="1" :value="chats">
        <ChatList />
      </v-window-item>
      <v-window-item id="2" :value="friends">
        <UserRequestList />
      </v-window-item>
      <v-window-item id="3" :value="settings">
        <SettingList @handleLogout="handleLogout" />
      </v-window-item>
    </v-window>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { PATH_ROUTER } from "~/shared/constant/router";

const tabs = defineModel({ default: "chats" });
const chats = ref("chats");
const friends = ref("friends");
const settings = ref("settings");
const authStore = useAuthStore();
const { logout } = useFirebaseAuth();
const isLoading = useState<boolean>("isLoading", () => false);
const handleLogout = async () => {
  isLoading.value = true;
  try {
    await logout();
    authStore.clearToken();
    navigateTo(PATH_ROUTER.login);
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.tabs-main {
  width: 100%;
  border-top: 1px solid rgb(198, 197, 197);
}

.icon-app {
  margin-left: 10px;
}

.navigator-drawer-container {
  width: 360px !important;
}
</style>
