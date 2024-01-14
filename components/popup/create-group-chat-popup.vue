<template>
  <v-dialog
    class="create-group-chat-popup-container"
    v-model="dialog"
    scrollable
    width="auto"
  >
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        @click="handleGetAllConnectedUsers"
        prepend-icon="mdi-account-group-outline"
        :title="`Create group chat with ${name}`"
      ></v-list-item>
    </template>

    <v-card class="user-selection-card" width="500px">
      <v-card-title>{{ `Create group chat with ${name}` }}</v-card-title>
      <v-divider></v-divider>
      <v-text-field
        class="group-name"
        variant="underlined"
        hide-details="auto"
        label="Group Name"
        v-model="groupName"
      ></v-text-field>

      <v-select
        v-model="userMappingSelectListByName"
        label="Selected members"
        multiple
        readonly
      />
      <v-card-text class="user-selection-list">
        <UserSelection
          v-for="user in connectedUsers"
          :key="user.id"
          v-model="selected"
          :value="user"
          :label="`${user.firstName} ${user.lastName}`"
          :disabled="user.id === navigatorTab.$state.currentTab.group?.oppositeUser.id"
        />
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="handleClosePopupCreateGroupChat"
        >
          Close
        </v-btn>
        <v-btn
          :disabled="userMappingSelectListByName.length < 2 || groupName.length === 0"
          color="blue-darken-1"
          variant="text"
          @click="handleCreateGroupChat"
        >
          Create
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
}>();
import { getDocs, query, collection, where } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firestore } = useNuxtApp();
const { $state } = useProfileStore();
const groupName = ref<string>("");
const dialog = ref<boolean>(false);
const connectedUsers = ref<TProfile[]>([]);
const oppositeUser = computed(() => navigatorTab.$state.currentTab.group?.oppositeUser!);
const selected = ref<TProfile[]>([]);
const userMappingSelectListByName = computed(() => {
  return JSON.parse(JSON.stringify(selected.value)).map(
    (e: TProfile) => `${e.firstName} ${e.lastName}`
  );
});

const handleClosePopupCreateGroupChat = () => {
  selected.value = [];
  groupName.value = "";
  dialog.value = false;
};

const handleGetAllConnectedUsers = async () => {
  selected.value = [oppositeUser.value];
  try {
    const q = query(
      collection($firestore, FIRESTORE_PATH.chat_collection),
      where("is_approved", "==", true),
      where("is_canceled", "==", false)
    );
    const userList = await getDocs(q);
    const tempConnectedUsers: TProfile[] = [oppositeUser.value];
    userList.forEach((doc) => {
      if (doc.id.split("-").includes($state.profile.id)) {
        const neededUsers =
          doc.data().sender.id === $state.profile.id
            ? doc.data().receiver
            : doc.data().sender;
        if (neededUsers.id !== oppositeUser.value.id) {
          tempConnectedUsers.push(neededUsers);
        }
      }
    });
    connectedUsers.value = tempConnectedUsers;
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
};

const handleCreateGroupChat = () => {
  const userSelectedList = JSON.parse(JSON.stringify(selected.value));
  const selfProfile = JSON.parse(JSON.stringify($state.profile));
  console.log("Group info created: ", groupName.value, [
    selfProfile,
    ...userSelectedList,
  ]);

  // Handle logic create group here

  handleClosePopupCreateGroupChat();
};
</script>

<style lang="scss" scoped>
.create-group-chat-popup-container .user-selection-list {
  height: 320px;
  margin-top: -25px;
}

.create-group-chat-popup-container .group-name {
  margin: 15px 10px;
}
</style>
