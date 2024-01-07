<template>
  <v-card>
    <v-layout>
      <v-navigation-drawer v-model="drawer" permanent @click="rail = false">
        <v-list-item
          prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
          title="Dang Duy Bang"
          nav
        />

        <v-divider></v-divider>

        <v-list density="compact" nav>
          <v-list-item
            prepend-icon="mdi-forum-outline"
            title="Chat List"
            value="chatList"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-account-group-outline"
            title="Users"
            value="users"
          ></v-list-item>
          <v-list-item
            prepend-icon="mdi-cog-outline"
            title="Settings"
            value="settings"
          ></v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main class="body-chat">
        <MessageHeader />
        <MessageInput />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      rail: true,
    };
  },
};
</script>

<style lang="scss" scoped>
.body-chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
