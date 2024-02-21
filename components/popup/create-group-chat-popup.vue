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
      <v-card-title v-if="mode !== 'add-more'">{{
        `Create Group Chat  ${name ? `with ${name}` : ""}`
      }}</v-card-title>
      <v-card-title v-if="mode === 'add-more'">{{
        `Information of group ${name ? `with ${name}` : ""}`
      }}</v-card-title>
      <v-divider></v-divider>

      <div v-if="mode === 'add-more'" class="header-avatar">
        <v-avatar class="drawer-avatar" :image="groupAvatar" />
        <v-file-input
          v-model="files"
          accept="image/*"
          style="display: none"
          :id="inputElementId"
          @change="handleChangeAvatar"
        />
        <v-btn @click="onOpenFile()" class="upload-btn">
          <v-icon size="30" icon="mdi-camera-plus-outline"></v-icon>
        </v-btn>
      </div>
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
            mode !== 'create-new' &&
            user.id === navigatorTab.$state.currentTab.group?.oppositeUser?.id
          "
        />
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="blue-darken-1" variant="text" @click="closePopup"> Close </v-btn>
        <v-btn
          v-if="mode !== 'add-more'"
          :disabled="
            userMappingSelectListByName.length < 2 ||
            groupName.length === 0 ||
            groupAvatar.length === 0
          "
          color="blue-darken-1"
          variant="text"
          @click="handleCreateGroupChat"
        >
          Create
        </v-btn>
        <v-btn
          v-if="mode === 'add-more'"
          :disabled="selected.length === 0 && groupName === availableName"
          color="blue-darken-1"
          variant="text"
          @click="handleAddMoreMembersGroupChat"
        >
          Update
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  getDocs,
  query,
  collection,
  where,
  getDoc,
  doc,
  setDoc,
  updateDoc,
type DocumentData,
Query,
} from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
import { DEFAULT_AVATAR_GROUP } from "~/shared/constant/constant";
const props = defineProps<{
  title?: string;
  name?: string;
  mode?: "create-new" | "create-with-friend" | "add-more";
  availableName?: string;
  availableMembers?: TProfile[];
  availableAvatar?: string;
  onClose?: (groupName: string, members: TProfile[]) => void
}>();

const { mode, availableName, availableMembers, availableAvatar, onClose } = props;

const navigatorTab = useNavigatorTabStore();
const { $firestore } = useNuxtApp();
const { $state } = useProfileStore();
const navigator = useNavigatorTabStore();
const groupName = ref<string>("");
const groupAvatar = ref<string>("");
const dialog = ref<boolean>(false);
const connectedUsers = ref<TProfile[]>([]);
const oppositeUser = computed(() => navigatorTab.$state.currentTab.group?.oppositeUser!);
const selected = ref<TProfile[]>([]);
const { uploadCloudinary } = useCloudinary();
const { inputElementId, onOpenFile } = useElement();
const files = ref<File[]>([]);

const userMappingSelectListByName = computed(() => {
  return JSON.parse(JSON.stringify(selected.value)).map(
    (e: TProfile) => `${e.firstName} ${e.lastName}`
  );
});

const handleChangeAvatar = async () => {
  try {
    const secure_url = await uploadCloudinary(files.value[0]);
    if (secure_url) {
      groupAvatar.value = secure_url;
    }
  } catch (error) {
    console.log(error);
  }
};

const closePopup = () => {
  selected.value = [];
  groupName.value = "";
  dialog.value = false;
};

const addMoreMember = async (q:  Query<DocumentData, DocumentData>) => {
  if (availableName && availableAvatar) {
    groupName.value = availableName;
    groupAvatar.value = availableAvatar;
  }
  try {
    const userList = await getDocs(q);
    const tempConnectedUsers: TProfile[] = [];
    userList.docs.forEach(async (chatItem, index) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
        const neededUser: TProfile =
          adminProfile.id === $state.profile.id
            ? memberProfile.data() as TProfile
            : adminProfile.data() as TProfile;

        if(availableMembers && !availableMembers.map(e => e.id).includes(neededUser.id)) {
          tempConnectedUsers.push(neededUser as TProfile);
        }
      }
    });
    setTimeout(() => {
      connectedUsers.value = tempConnectedUsers;
    }, 500)
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
}

const createNewGroupInit = async (q:  Query<DocumentData, DocumentData>) => {
  try {
    const userList = await getDocs(q);
    const tempConnectedUsers: TProfile[] = [];
    userList.docs.forEach(async (chatItem, index) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
        const neededUser: TProfile =
          adminProfile.id === $state.profile.id
            ? memberProfile.data() as TProfile
            : adminProfile.data() as TProfile;

        tempConnectedUsers.push(neededUser as TProfile);
      }
    });
    setTimeout(() => {
      connectedUsers.value = tempConnectedUsers;
    }, 500)
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
};

const createNewGroupWithAvailableFriend = async (q:  Query<DocumentData, DocumentData>) => {
  if (oppositeUser.value) {
    selected.value = [oppositeUser.value];
  }
  try {
    const userList = await getDocs(q);
    const tempConnectedUsers: TProfile[] = [oppositeUser.value];
    userList.docs.forEach(async (chatItem, index) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
        const neededUser =
          adminProfile.id === $state.profile.id
            ? (memberProfile.data() as TProfile)
            : (adminProfile.data() as TProfile);
        if (neededUser.id !== oppositeUser.value.id) {
          tempConnectedUsers.push(neededUser);
        }
      }
    });
    setTimeout(() => {
      connectedUsers.value = tempConnectedUsers;
    }, 500)
  } catch (error) {
    console.error("Error get all connected users: ", error);
  }
};

const handleGetAllConnectedUsers = () => {
  const q = query(
      collection($firestore, FIRESTORE_PATH.chat_collection),
      where("is_approved", "==", true),
      where("is_canceled", "==", false),
      where("group_type", "==", "private")
    );
  if (mode === "create-new") {
    createNewGroupInit(q);
  } else if (mode === "create-with-friend") {
    createNewGroupWithAvailableFriend(q);
  } else {
    addMoreMember(q);
  }
};

const handleAddMoreMembersGroupChat = async () => {
  if (!navigator.$state.currentTab.group?.group_id || !availableMembers) {
    return;
  }
  const userSelectedList = JSON.parse(JSON.stringify(selected.value));
  const selectionRefs = [...availableMembers.filter(mem => mem.id !== $state.profile.id), ...userSelectedList].map((value: TProfile) => {
    return doc($firestore, `${FIRESTORE_PATH.user_collection}/${value.id}`);
  });
  try {
    onClose && onClose(groupName.value, [...availableMembers.filter(mem => mem.id !== $state.profile.id), ...userSelectedList]);
    const objectUpdate = selected.value.length > 0 ?
      {
        member_refs: selectionRefs,
        group_name: groupName.value,
        avatar: groupAvatar.value
      } : {
        group_name: groupName.value,
        avatar: groupAvatar.value
      }

    await updateDoc(
      doc($firestore, FIRESTORE_PATH.chat_collection, navigator.$state.currentTab.group?.group_id),
      objectUpdate
    );
    closePopup();
    console.log("Add more member successfully");
  } catch (err) {
    console.error("Error add more member: ", err);
  }
}

const handleCreateGroupChat = async () => {
  const userSelectedList = JSON.parse(JSON.stringify(selected.value));
  const selectionRefs = userSelectedList.map((value: TProfile) => {
    return doc($firestore, `${FIRESTORE_PATH.user_collection}/${value.id}`);
  });

  const documentGroupId = doc(collection($firestore, FIRESTORE_PATH.chat_collection)).id;
  const dataAdd: TMessageGroup = {
    group_id: documentGroupId,
    group_name: groupName.value,
    group_type: "group",
    description: "",
    avatar: DEFAULT_AVATAR_GROUP,
    is_approved: true,
    is_canceled: false,
    last_message: {
      message_id: "message-group-0",
      user_id: $state.profile.id,
      user_ref: doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
      content: "Say Hello to start the conservation !",
      datetime: new Date().toString(),
      created_at: new Date().getTime(),
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
  closePopup();
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

.create-group-chat-popup-container .header-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
}

.header-avatar .drawer-avatar {
  width: 55px;
  height: 55px;
  opacity: 0.9;
}

.header-avatar .upload-btn {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 60px;
  background-color: rgba($color: #000000, $alpha: 0.1);
  opacity: 0.7;
}
</style>
