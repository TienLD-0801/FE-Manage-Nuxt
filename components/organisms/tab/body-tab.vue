<template>
  <v-main class="body-chat" v-if="navigatorTab.$state.currentTab === 'chat'">
    <MessageHeader />
    <MessageInput />
  </v-main>
  <v-main class="body-setting" v-else-if="navigatorTab.$state.currentTab === 'settings'">
    <v-container>Setting</v-container>
  </v-main>
  <v-main class="body-security" v-else-if="navigatorTab.$state.currentTab === 'security'">
    <v-container>Security</v-container>
  </v-main>
  <v-main class="body-user" v-else>
    <v-container>User</v-container>
  </v-main>
</template>

<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();
</script>

<style lang="scss" scoped>
.body-chat {
  width: calc(100vw - 360px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 100px;
}
</style>
