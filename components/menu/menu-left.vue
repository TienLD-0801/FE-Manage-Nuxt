<template>
  <Loading :is-loading="isLoading" />
  <v-navigation-drawer :width="380" permanent>
    <v-toolbar color="#e4e8eb" class="px-0">
      <v-icon class="icon-app" size="large" icon="mdi-snapchat" />
      <v-toolbar-title>Chatty</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <div class="drawer-create-new-group">
        <CreateGroupChatPopup mode="create-new" />
      </div>

      <template v-slot:extension>
        <div class="tabs-main">
          <v-tabs v-model="tabs" color="primary" grow>
            <v-tab :value="chats">
              <v-icon>mdi-forum-outline</v-icon>
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
const settings = ref("settings");
const authStore = useAuthStore();
const { logout } = useFirebaseAuth();
const isLoading = ref<boolean>(false);
const handleLogout = async () => {
  isLoading.value = true;
  try {
    await logout();
    navigateTo(PATH_ROUTER.login, { external: true });
    localStorage.clear();
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
.custom-badge {
  display: flex;
  gap: 10px;
}

.icon-app {
  margin-left: 10px;
}
</style>
