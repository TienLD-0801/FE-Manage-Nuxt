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

            <v-list class="options-info-chat mx-auto" width="300">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  class="description-text"
                  title="Description"
                  :text="description"
                />
                <v-icon class="description-icon" icon="mdi-text-box-edit-outline" />
              </v-expansion-panels>

              <CreateGroupChatPopup :name="name" />

              <v-list-item
                prepend-icon="mdi-folder-multiple-image"
                title="Media, files and links"
              ></v-list-item>
            </v-list>
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

const description = `Meet: https://meet.google.com/ezf-soqu-ozx  \n DEV: https://alb-dev-apne1-cd022-01.zero-events.com \n Follow deploy : https://app.circleci.com/pipelines/bitbucket/hi817develop/bp-webapp_functiontest`;

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

.description-text {
  font-size: 0.8rem;
  white-space: pre-line;
}

.description-icon {
  position: absolute;
  left: 13px;
  top: 13px;
}
</style>
