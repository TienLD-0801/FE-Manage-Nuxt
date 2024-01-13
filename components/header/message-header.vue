<template>
  <v-toolbar class="message-toolbar" density="compact">
    <div class="message-header-bar">
      <v-list-item :prepend-avatar="avatar" :title="name" :subtitle="'Active now'" nav />
      <div>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn @click.stop="rail = !rail" icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
        <v-navigation-drawer :width="300" location="right" v-if="rail" permanent>
          <div class="left-drawer-chat">
            <v-list>
              <v-list-item>
                <div class="header-profile">
                  <v-avatar class="avatar" :image="avatar" />
                  <v-list-item-title>{{ name }}</v-list-item-title>
                </div>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>

            <v-card class="mx-auto" width="300">
              <v-list>
                <v-list-item
                  prepend-icon="mdi-text-box-edit-outline"
                  title="Description"
                ></v-list-item>

                <v-list-group value="Users">
                  <template v-slot:activator="{ props }">
                    <v-list-item
                      v-bind="props"
                      prepend-icon="mdi-plus-circle-multiple-outline"
                      title="Options"
                    ></v-list-item>
                  </template>

                  <v-list-group value="Admin">
                    <template v-slot:activator="{ props }">
                      <v-list-item
                        prepend-icon="mdi-account-group-outline"
                        v-bind="props"
                        title="Create group chat"
                      ></v-list-item>
                    </template>
                  </v-list-group>

                  <v-list-group value="Actions">
                    <template v-slot:activator="{ props }">
                      <v-list-item
                        prepend-icon="mdi-bell-outline"
                        v-bind="props"
                        title="Notifications"
                      ></v-list-item>
                    </template>
                  </v-list-group>
                </v-list-group>

                <v-list-item
                  prepend-icon="mdi-folder-multiple-image"
                  title="Media, files and links"
                ></v-list-item>
              </v-list>
            </v-card>
          </div>
        </v-navigation-drawer>
      </div>
    </div>
  </v-toolbar>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  avatar: string;
}>();

const rail = ref(false);
</script>

<style lang="scss" scoped>
.message-toolbar {
  height: 65px;
  border-bottom: 1px solid rgb(208, 208, 208);
  display: flex;
  justify-content: center;
}
.message-toolbar .message-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}

.message-header-bar .left-drawer-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
