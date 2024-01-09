<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader
      :name="`${$state.chatProfile?.firstName} ${$state.chatProfile?.lastName}`"
      :avatar="$state.chatProfile?.avatar"
    />
    <MessageList />
    <MessageInput />
  </v-main>
</template>

<script lang="ts" setup>
const { $state } = useChatProfileStore();
</script>

<style lang="scss" scoped>
.chat-container {
  padding-bottom: 16px;
}
</style>
