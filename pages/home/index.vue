import { ChatInputForm } from '../../.nuxt/components.d';
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
        <template>
          <v-card color="grey-lighten-4" flat height="200px" rounded="0">
            <v-toolbar density="compact">
              <v-list-item
                prepend-avatar="https://randomuser.me/api/portraits/men/87.jpg"
                title="Le Duy Tien"
                nav
              />
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card>
        </template>
        <ChatInputForm />
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
