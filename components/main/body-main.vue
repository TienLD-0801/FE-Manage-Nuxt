<template>
  <DefaultPanel v-if="navigatorTab.$state.currentTab === 'default'" />
  <ChatPanel v-if="navigatorTab.$state.currentTab === 'chat'" />
  <SecurityPanel v-else-if="navigatorTab.$state.currentTab === 'security'" />
  <UserPanel v-else-if="navigatorTab.$state.currentTab === 'users'" />
  <SettingPanel v-else />
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
