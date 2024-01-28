<template>
  <DefaultPanel v-if="navigatorTab.$state.currentTab.tab === 'default'" />
  <ChatPanel v-if="navigatorTab.$state.currentTab.tab === 'chats'" />
  <SecurityPanel v-else-if="navigatorTab.$state.currentTab.tab === 'security'" />
  <UserPanel v-else-if="navigatorTab.$state.currentTab.tab === 'users'" />
  <SettingPanel v-else-if="navigatorTab.$state.currentTab.tab === 'settings'" />
</template>

<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();
</script>

<style lang="scss" scoped>
.main-panel {
  overflow: hidden;
}
</style>
