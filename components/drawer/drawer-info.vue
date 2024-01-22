<template>
  <div>
    <v-btn @click="$emit('on-audio-called')" icon>
      <v-icon>mdi-phone</v-icon>
    </v-btn>
    <v-btn @click="$emit('on-video-called')" icon>
      <v-icon>mdi-video</v-icon>
    </v-btn>
    <v-btn icon>
      <v-icon>mdi-magnify</v-icon>
    </v-btn>
    <v-btn @click.stop="rail = !rail" icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn>
    <v-navigation-drawer :width="300" location="right" v-if="rail" permanent>
      <div class="right-drawer-chat">
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
            <v-expansion-panel class="description-panel">
              <v-expansion-panel-title>
                Description
                <template v-slot:actions="{ expanded }">
                  <v-icon v-if="!expanded" :icon="'mdi-chevron-down'"></v-icon>
                  <v-dialog
                    class="create-group-chat-popup-container"
                    v-model="dialog"
                    scrollable
                    width="auto"
                    v-if="expanded"
                  >
                    <template v-slot:activator="{ props }">
                      <v-icon
                        class="edit-description-icon"
                        @click="handleOpenEditDescriptionPopup"
                        v-bind="props"
                        icon="mdi-pencil-outline"
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
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ descriptionPrevious.length ? descriptionPrevious : "No description" }}
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-icon class="description-icon" icon="mdi-text-box-edit-outline"></v-icon>
          </v-expansion-panels>

          <v-expansion-panels
            v-if="$state.currentTab.group?.group_type === 'group'"
            variant="accordion"
          >
            <v-expansion-panel class="member-panel">
              <v-expansion-panel-title>Members</v-expansion-panel-title>
              <v-expansion-panel-text>
                <div class="member-list-panel">
                  <div
                    v-for="member in memberMapList"
                    :key="member.id"
                    class="member-item"
                  >
                    <v-avatar class="message-avatar" :image="member.avatar"></v-avatar>
                    <span>{{ `${member.firstName} ${member.lastName}` }}</span>
                    <v-list-item-subtitle v-if="member?.role === 'admin'">{{
                      `(${member.role})`
                    }}</v-list-item-subtitle>
                  </div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-icon class="member-icon" icon="mdi-account-group-outline"></v-icon>
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
</template>

<script lang="ts" setup>
defineEmits(["on-audio-called", "on-video-called"]);

import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $state } = useNavigatorTabStore();
const { $firestore } = useNuxtApp();
const dialog = ref<boolean>(false);
const rail = ref<boolean>(false);
const memberMapList = ref<TProfile[]>([]);

const descriptionGroup = computed((): string => {
  return $state.currentTab.group?.description || "";
});

const descriptionPrevious = ref<string>(descriptionGroup.value);
const descriptionContent = ref<string>(descriptionGroup.value);

const getMembers = () => {
  const memberTemp: any = [];
  const qChats = query(
    collection($firestore, FIRESTORE_PATH.chat_collection),
    where("is_approved", "==", true),
    where("is_canceled", "==", false)
  );

  onSnapshot(qChats, () => {
    $state.currentTab.group?.admin_refs.length > 0 &&
      $state.currentTab.group?.admin_refs.forEach(async (ref: any) => {
        const memberInfo = await getDoc(ref);
        if (memberInfo.data()) {
          memberTemp.push({
            ...(memberInfo.data() as TProfile),
            role: "admin",
          });
        }
      });

    $state.currentTab.group?.member_refs.length > 0 &&
      $state.currentTab.group?.member_refs.forEach(async (ref: any) => {
        const memberInfo = await getDoc(ref);
        if (memberInfo.data()) {
          memberTemp.push({
            ...(memberInfo.data() as TProfile),
            role: "member",
          });
        }
      });
  });

  setTimeout(() => {
    memberMapList.value = memberTemp;
  }, 500);
};

const fullName = computed(() => {
  descriptionPrevious.value = descriptionGroup.value;
  const firstName = $state.currentTab.group?.oppositeUser?.firstName;
  const lastName = $state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});

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

const currentGroup = computed(() => $state.currentTab?.group);
watch(currentGroup, () => {
  getMembers();
});
</script>

<style lang="scss" scoped>
.message-header-bar .right-drawer-chat {
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

.description-panel {
  font-size: 0.8rem;
  white-space: pre-line;
  word-wrap: break-word;
}

.memo-text {
  font-size: 0.8rem;
  white-space: pre-line;
  word-wrap: break-word;
}

.description-icon {
  position: absolute;
  left: 13px;
  top: 13px;
}

.member-icon {
  position: absolute;
  left: 13px;
  top: 13px;
}

.description-group-card .description-input {
  height: 350px;
}

.edit-description-icon {
  &:hover {
    opacity: 0.5;
  }
}

.member-panel .member-list-panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-item {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>