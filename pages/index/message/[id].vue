<template>
  <v-main class="main-panel">
    <MessageHeader />
    <MessageList />
  </v-main>
</template>

<script lang="ts" setup>
useHead({
  title: "Chats",
});
</script>

<style lang="scss" scoped>
.main-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100vh;
}
</style>
