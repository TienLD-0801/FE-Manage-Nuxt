<template>
  <v-list class="friends-list-container" density="compact" nav>
    <v-list-item
      @click="navigatorTab.changeNavigatorTab('security')"
      prepend-icon="mdi-account-lock"
      title="Security"
      value="security"
      color="primary"
    ></v-list-item>
    <v-list-item
      @click="navigatorTab.changeNavigatorTab('users')"
      prepend-icon="mdi-account-group-outline"
      title="Users"
      value="users"
      color="primary"
    ></v-list-item>
    <v-list-item
      @click="navigatorTab.changeNavigatorTab('settings')"
      prepend-icon="mdi-cog-outline"
      title="Settings"
      value="settings"
      color="primary"
    ></v-list-item>

    <v-dialog width="500">
      <template v-slot:activator="{ props }">
        <v-list-item
          class="logout-btn"
          prepend-icon="mdi-logout"
          title="Logout"
          value="logout"
          color="red"
          v-bind="props"
        ></v-list-item>
      </template>

      <template v-slot:default="{}">
        <v-card title="Logout">
          <v-card-text> Are you sure logout this account ? </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Confirm" @click="$emit('handleLogout')"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </v-list>
</template>
<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();
</script>

<style lang="scss" scoped>
.setting-list-container {
  border-bottom: unset !important;
}

.logout-btn {
  color: red;
}
</style>
