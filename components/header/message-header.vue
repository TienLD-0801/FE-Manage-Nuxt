<template>
  <v-toolbar class="message-toolbar" density="compact">
    <div class="message-header-bar">
      <v-list-item
        :prepend-avatar="$state.currentTab.group?.oppositeUser?.avatar"
        :title="fullName"
        :subtitle="'Active now'"
        nav
      />
      <div>
        <v-btn @click="$emit('on-called')" icon>
          <v-icon> mdi-phone</v-icon>
        </v-btn>
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
                  <v-avatar
                    class="avatar"
                    :image="$state.currentTab.group?.oppositeUser?.avatar"
                  />
                  <v-list-item-title>{{ fullName }}</v-list-item-title>
                </div>
              </v-list-item>
              <v-divider></v-divider>
            </v-list>

            <v-list class="options-info-chat mx-auto" width="300">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel
                  @click="descriptionPrevious = descriptionGroup"
                  class="description-text"
                  title="Description"
                  :text="
                    descriptionPrevious.length ? descriptionPrevious : 'No description'
                  "
                />
                <v-dialog
                  class="create-group-chat-popup-container"
                  v-model="dialog"
                  scrollable
                  width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-icon
                      @click="handleOpenEditDescriptionPopup"
                      v-bind="props"
                      class="description-icon"
                      icon="mdi-text-box-edit-outline"
                    ></v-icon>
                  </template>

                  <v-card class="description-group-card" width="500px">
                    <v-card-title>{{ `Edit Description` }}</v-card-title>

                    <v-divider></v-divider>
                    <v-container fluid>
                      <v-textarea
                        class="description-input"
                        counter
                        placeholder="Write description..."
                        v-model="descriptionContent"
                      ></v-textarea>
                    </v-container>

                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn color="blue-darken-1" variant="text" @click="closePopup">
                        Close
                      </v-btn>
                      <v-btn
                        color="blue-darken-1"
                        variant="text"
                        @click="handleSaveDescription"
                      >
                        Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-expansion-panels>

              <CreateGroupChatPopup
                v-if="$state.currentTab.group?.group_type === 'private'"
                :title="`Create group chat with ${fullName}`"
                :name="fullName"
              />

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
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $firestore } = useNuxtApp();
const { $state } = useNavigatorTabStore();
const descriptionGroup = computed(
  (): string => $state.currentTab.group?.description || ""
);
defineEmits(["on-called"]);
const descriptionPrevious = ref<string>(descriptionGroup.value);
const descriptionContent = ref<string>(descriptionGroup.value);

const fullName = computed(() => {
  descriptionPrevious.value = descriptionGroup.value;
  const firstName = $state.currentTab.group?.oppositeUser?.firstName;
  const lastName = $state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});
const rail = ref(false);
const dialog = ref<boolean>(false);

const handleOpenEditDescriptionPopup = () => {
  descriptionContent.value = descriptionPrevious.value;
};

const closePopup = () => {
  dialog.value = false;
};

const handleSaveDescription = async () => {
  if (!$state.currentTab.group?.group_id) {
    return;
  }
  try {
    await updateDoc(
      doc($firestore, FIRESTORE_PATH.chat_collection, $state.currentTab.group?.group_id),
      {
        description: descriptionContent.value,
      }
    );
    descriptionPrevious.value = descriptionContent.value;

    console.log("Save description successfully");
  } catch (err) {
    console.error("Error save description: ", err);
  } finally {
    closePopup();
  }
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

.message-header-bar .left-drawer-chat {
  height: auto;
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
  word-wrap: break-word;
}

.description-icon {
  position: absolute;
  left: 13px;
  top: 13px;

  &:hover {
    opacity: 0.5;
  }
}

.description-group-card .description-input {
  height: 350px;
}
</style>
