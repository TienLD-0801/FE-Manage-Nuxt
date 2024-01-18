<template>
  <v-toolbar class="message-toolbar" density="compact">
    <div class="message-header-bar">
      <v-list-item
        :prepend-avatar="avatar"
        :title="fullName"
        :subtitle="'Active now'"
        nav
      />
      <DrawerInfo />
    </div>
  </v-toolbar>
</template>

<script lang="ts" setup>
const { $state } = useNavigatorTabStore();

const fullName = computed(() => {
  const firstName = $state.currentTab.group?.oppositeUser?.firstName;
  const lastName = $state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});

const avatar = computed(() => $state.currentTab.group?.oppositeUser?.avatar);
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
