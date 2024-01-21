<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader @on-called="handleCalled" />
    <MessageList />
  </v-main>
</template>

<script lang="ts" setup>
const { $state } = useNavigatorTabStore();
const self = useProfileStore();
const call = useCall();

const handleCalled = async () => {
  const idCalled = `${self.$state.profile.id}-${$state.currentTab.group?.oppositeUser?.id}`;
  navigateTo(`/video/${idCalled}?status=start`, {
    open: {
      target: "_blank",
      windowFeatures: {
        width: 900,
        height: 650,
        left: (window.innerWidth - 900) / 2,
        top: (window.innerHeight - 600) / 2,
        popup: true,
      },
    },
  });
};
</script>

<style lang="scss" scoped>
.chat-container {
  margin: 0;
}
</style>
