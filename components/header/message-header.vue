<template>
  <v-toolbar class="message-toolbar" density="compact">
    <div class="message-header-bar">
      <v-list-item
        :prepend-avatar="avatar"
        :title="fullName"
        :subtitle="'Active now'"
        nav
      />
      <DrawerInfo @on-called="handleCalled" />
    </div>
  </v-toolbar>
</template>

<script lang="ts" setup>
const { $state } = useNavigatorTabStore();
const self = useProfileStore();

const fullName = computed(() => {
  const firstName = $state.currentTab.group?.oppositeUser?.firstName;
  const lastName = $state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});
const avatar = computed(() => $state.currentTab.group?.oppositeUser?.avatar);

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
.message-toolbar {
  height: 65px;
  border-bottom: 1px solid rgb(208, 208, 208);
  display: flex;
  justify-content: center;
  padding: 0px 20px;
}
.message-toolbar .message-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
