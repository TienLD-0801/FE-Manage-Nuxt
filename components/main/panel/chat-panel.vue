<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader
      :name="fullName"
      :avatar="navigatorTab.$state.currentTab.group?.oppositeUser?.avatar || ''"
    />
    <MessageList />
  </v-main>
</template>

<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();

const fullName = computed(() => {
  const firstName = navigatorTab.$state.currentTab.group?.oppositeUser?.firstName;
  const lastName = navigatorTab.$state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});
</script>

<style lang="scss" scoped>
.chat-container {
  margin: 0;
}
</style>
