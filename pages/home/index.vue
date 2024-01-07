<template>
  <v-card>
    <v-layout>
      <NavigatorDrawer />
      <v-main class="body-chat">
        <MessageHeader />
        <MessageInput />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
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
