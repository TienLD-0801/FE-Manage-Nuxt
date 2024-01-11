<template>
  <DefaultPanel v-if="navigatorTab.$state.currentTab.tab === 'default'" />
  <ChatPanel v-if="navigatorTab.$state.currentTab.tab === 'chats'" />
  <SecurityPanel v-else-if="navigatorTab.$state.currentTab.tab === 'security'" />
  <UserPanel v-else-if="navigatorTab.$state.currentTab.tab === 'users'" />
  <SettingPanel v-else-if="navigatorTab.$state.currentTab.tab === 'settings'" />
</template>

<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {});
</script>

<style lang="scss" scoped>
.main-panel {
  overflow: hidden;
}
</style>
