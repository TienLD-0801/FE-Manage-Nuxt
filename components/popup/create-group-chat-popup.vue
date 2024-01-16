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
        prepend-icon="mdi-account-multiple-plus-outline"
        :title="title || ''"
      ></v-list-item>
    </template>

    <v-card class="user-selection-card" width="500px">
      <v-card-title>{{
        `Create Group Chat  ${name ? `with ${name}` : ""}`
      }}</v-card-title>
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
          :disabled="
            !isNewGroup &&
            user.id === navigatorTab.$state.currentTab.group?.oppositeUser?.id
          "
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
const props = defineProps<{
  title?: string;
  name?: string;
  isNewGroup?: boolean;
}>();
const { isNewGroup } = props;
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
import { DEFAULT_AVATAR_GROUP } from "~/shared/constant/constant";

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
  if (!isNewGroup && oppositeUser.value) {
    selected.value = [oppositeUser.value];
  }
  try {
    const q = query(
      collection($firestore, FIRESTORE_PATH.chat_collection),
      where("is_approved", "==", true),
      where("is_canceled", "==", false)
    );
    const userList = await getDocs(q);

    // Refactor sau
    const tempConnectedUsers: TProfile[] = [];
    if (isNewGroup) {
      userList.forEach(async (chatItem) => {
        const adminRef = chatItem.data().admin_refs[0];
        const memberRef = chatItem.data().member_refs[0];
        const [adminProfile, memberProfile] = await Promise.all([
          getDoc(adminRef),
          getDoc(memberRef),
        ]);
        if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
          const neededUsers =
            adminProfile.id === $state.profile.id
              ? memberProfile.data()
              : adminProfile.data();
          tempConnectedUsers.push(neededUsers as TProfile);
        }
      });
    } else {
      userList.forEach(async (chatItem) => {
        const adminRef = chatItem.data().admin_refs[0];
        const memberRef = chatItem.data().member_refs[0];
        const [adminProfile, memberProfile] = await Promise.all([
          getDoc(adminRef),
          getDoc(memberRef),
        ]);
        if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
          const neededUsers =
            adminProfile.id === $state.profile.id
              ? (memberProfile.data() as TProfile)
              : (adminProfile.data() as TProfile);
          if (neededUsers.id !== oppositeUser.value.id) {
            tempConnectedUsers.push(neededUsers);
          }
        }
      });
    }
    setTimeout(() => {
      connectedUsers.value = tempConnectedUsers;
    }, 500);
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
};

const handleCreateGroupChat = async () => {
  const userSelectedList = JSON.parse(JSON.stringify(selected.value));
  const selfProfile = JSON.parse(JSON.stringify($state.profile));
  console.log("A new group created!");
  console.log("Group Name ", groupName.value);
  console.log("Group admins: ", [selfProfile]);
  console.log("Group members: ", userSelectedList);

  const selectionRefs = userSelectedList.map((value: TProfile) => {
    return doc($firestore, `${FIRESTORE_PATH.user_collection}/${value.id}`);
  });

  const documentGroupId = doc(collection($firestore, FIRESTORE_PATH.chat_collection)).id;
  const dataAdd: TMessageGroup = {
    group_id: documentGroupId,
    group_name: groupName.value,
    group_type: "group",
    avatar: DEFAULT_AVATAR_GROUP,
    is_approved: true,
    is_canceled: false,
    last_message: {
      message_id: "message-group-0",
      user_id: $state.profile.id,
      user_ref: doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
      content: "Say Hello to start the conservation !",
      created_at: new Date().toString(),
    },
    admin_refs: [
      doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
    ],
    member_refs: selectionRefs,
  };
  try {
    await setDoc(
      doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId),
      dataAdd
    );
    console.log("Create group successfully");
  } catch (err) {
    console.error("Error create group: ", err);
  }

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
