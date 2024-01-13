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

              <v-dialog v-model="dialog" scrollable width="auto">
                <template v-slot:activator="{ props }">
                  <v-list-item
                    v-bind="props"
                    href="#"
                    prepend-icon="mdi-account-group-outline"
                    :title="`Create group chat with ${name}`"
                  ></v-list-item>
                </template>

                <v-card>
                  <v-card-title>Select Members</v-card-title>
                  <v-divider></v-divider>
                  <v-card-text style="height: 300px">
                    <v-radio-group v-model="dialogm1" column>
                      <v-radio label="Le Duy Tien" value="bahamas"></v-radio>
                      <v-radio label="Nguyen Tran Phuong Tram" value="bahrain"></v-radio>
                      <v-radio label="Trieu Tan Vinh" value="bangladesh"></v-radio>
                      <v-radio label="Tran Chi Huu" value="barbados"></v-radio>
                      <v-radio label="Nguyen Anh Duy" value="belarus"></v-radio>
                      <v-radio label="Duong Van Khuong" value="belgium"></v-radio>
                      <v-radio label="Nguyen Thanh Phong" value="belize"></v-radio>
                      <v-radio label="Dinh Gia Kiet" value="benin"></v-radio>
                      <v-radio label="Pham Gia Bao" value="bhutan"></v-radio>
                      <v-radio label="Nguyen An Nhien" value="bolivia"></v-radio>
                      <v-radio label="Bui Binh Trung" value="bosnia"></v-radio>
                      <v-radio label="Nguyen Nhut Tan" value="botswana"></v-radio>
                      <v-radio label="Hoang Tan Vinh" value="brazil"></v-radio>
                      <v-radio label="Le Duy Khanh" value="brunei"></v-radio>
                      <v-radio label="Nguyen Yen Nhi" value="bulgaria"></v-radio>
                    </v-radio-group>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                      Close
                    </v-btn>
                    <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                      Create
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

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

const dialogm1 = ref("");
const dialog = ref(false);

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
