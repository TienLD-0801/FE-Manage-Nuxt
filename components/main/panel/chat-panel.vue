<template>
  <v-main class="main-panel-container">
    <MessageHeader
      :name="`${$state.chatProfile?.firstName} ${$state.chatProfile?.lastName}`"
      :avatar="$state.chatProfile?.avatar"
    />
    <MessageInput />
  </v-main>
</template>

<script lang="ts" setup>
const { $state } = useChatProfileStore();
</script>

<style></style>
