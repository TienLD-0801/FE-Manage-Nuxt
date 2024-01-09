<template>
  <v-main class="main-panel-container">
    <MessageHeader :avatar="$state.profile?.avatar" />
    <MessageInput />
  </v-main>
</template>

<script lang="ts" setup>
const { $state } = useProfileStore();
</script>

<style></style>
