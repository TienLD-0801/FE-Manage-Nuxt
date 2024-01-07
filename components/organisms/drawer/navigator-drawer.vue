<template>
  <v-navigation-drawer class="navigator-drawer-container">
    <v-card width="100%" class="mx-auto">
      <v-toolbar color="#e4e8eb" class="px-0">
        <v-icon class="icon-app" size="large" icon="mdi-snapchat" />
        <v-toolbar-title>Chat Nuxt</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        <template v-slot:extension>
          <div class="tabs-main">
            <v-tabs v-model="tabs" color="primary" grow>
              <v-tab :value="1">
                <v-icon>mdi-forum-outline</v-icon>
              </v-tab>

              <v-tab :value="2">
                <v-icon>mdi-cog-outline</v-icon>
              </v-tab>
            </v-tabs>
          </div>
        </template>
      </v-toolbar>

      <v-window v-model="tabs">
        <v-window-item :key="1" :value="1">
          <ChatList />
        </v-window-item>

        <v-window-item :key="2" :value="2">
          <SettingList />
        </v-window-item>
      </v-window>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      tabs: null,
    };
  },
};
</script>

<style lang="scss" scoped>
.tabs-main {
  width: 100%;
  border-top: 1px solid rgb(198, 197, 197);
}

.icon-app {
  margin-left: 10px;
}

.navigator-drawer-container {
  width: 360px !important;
}
</style>
