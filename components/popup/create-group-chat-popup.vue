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
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
          Close
        </v-btn>
        <v-btn
          :disabled="userMappingSelectListByName.length < 2"
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
const dialog = ref(false);
const connectedUsers = ref<TProfile[]>([]);
const selected = ref<TProfile[]>([navigatorTab.$state.currentTab.group?.oppositeUser!]);
const userMappingSelectListByName = computed(() => {
  return JSON.parse(JSON.stringify(selected.value)).map(
    (e: TProfile) => `${e.firstName} ${e.lastName}`
  );
});

const handleGetAllConnectedUsers = async () => {
  try {
    const q = query(
      collection($firestore, FIRESTORE_PATH.chat_collection),
      where("is_approved", "==", true),
      where("is_canceled", "==", false)
    );
    const userList = await getDocs(q);
    const tempConnectedUsers: TProfile[] = [];
    userList.forEach((doc) => {
      if (doc.id.split("-").includes($state.profile.id)) {
        const neededUsers =
          doc.data().sender.id === $state.profile.id
            ? doc.data().receiver
            : doc.data().sender;
        tempConnectedUsers.push(neededUsers);
      }
    });
    connectedUsers.value = tempConnectedUsers;
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
};

const handleCreateGroupChat = () => {
  const userSelectedList = JSON.parse(JSON.stringify(selected.value));
  console.log("User created in group: ", [$state.profile, ...userSelectedList]);
  // Handle logic create group here
};
</script>

<style lang="scss" scoped>
.create-group-chat-popup-container .user-selection-list {
  height: 400px;
}
</style>
