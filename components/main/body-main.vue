<template>
  <DefaultPanel v-if="navigatorTab.$state.currentTab === 'default'" />
  <ChatPanel v-if="navigatorTab.$state.currentTab === 'chat'" />
  <SecurityPanel v-else-if="navigatorTab.$state.currentTab === 'security'" />
  <UserPanel v-else-if="navigatorTab.$state.currentTab === 'users'" />
  <SettingPanel v-else />
</template>

<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();
</script>

<style lang="scss" scoped>
.main-panel {
  background: red;
  overflow: hidden;
}
</style>
