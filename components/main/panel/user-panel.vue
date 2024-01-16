<template>
  <v-main class="user-panel-container main-panel-container">
    <div class="user-panel-header">
      <h2>Users</h2>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </div>
    <v-tabs v-model="tab" color="primary" align-tabs="center">
      <v-tab value="all">All</v-tab>
      <v-tab value="requests"
        >Requests
        <v-badge color="red" :content="requestList.length" v-if="requestList.length"
      /></v-tab>
    </v-tabs>
    <v-window class="user-tab-container" v-model="tab">
      <v-window-item key="all" value="all">
        <div class="user-panel-list">
          <UserBox
            :is-skeleton="isLoading"
            v-for="user in users"
            :key="user.id"
            :user="user"
            @on-add-user="handleAddUser(user)"
            @on-approve-user="handleApproveUser(user)"
            @on-deny-user="handleDenyUser(user)"
            @on-chat-user="handleChatUser(user)"
          />
          <v-container class="no-user-style" v-if="!users?.length">
            <p>No users here.</p>
            <div class="no-user-photo" />
          </v-container>
        </div>
      </v-window-item>
      <v-window-item key="requests" value="requests">
        <div class="user-panel-list">
          <UserBox
            :is-skeleton="isLoading"
            v-for="request in requestList"
            :key="request.id"
            :user="request"
            @on-approve-user="handleApproveUser(request)"
            @on-deny-user="handleDenyUser(request)"
          />
          <v-container class="no-user-style" v-if="!requestList.length">
            <p>No users here.</p>
            <div class="no-user-photo" />
          </v-container>
        </div>
      </v-window-item>
    </v-window>
  </v-main>
</template>

<script lang="ts" setup>
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $firestore } = useNuxtApp();
const { $state } = useProfileStore();
const users = ref<TProfile[]>([]);
const tab = ref(null);
const requestList = useState<TProfile[]>("requestList", () => []);
const navigatorTab = useNavigatorTabStore();
const isLoading = ref<boolean>(false);
const getAllUsers = async () => {
  try {
    isLoading.value = true;
    const qUsers = query(
      collection($firestore, FIRESTORE_PATH.user_collection),
      where("id", "!=", $state.profile?.id)
    );
    const user = await getDocs(qUsers);
    user.forEach((userItem) => {
      users.value.push(userItem.data() as TProfile);
    });
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
};

const getAllRequests = () => {
  const q = query(collection($firestore, FIRESTORE_PATH.chat_collection));
  onSnapshot(q, (chatList) => {
    let templeChat: TProfile[] = [];
    chatList.docs.forEach(async (chatItem) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if (
        memberProfile.id === $state.profile.id &&
        !chatItem.data().is_approved &&
        !chatItem.data().is_canceled
      ) {
        templeChat.push(adminProfile.data() as TProfile);
      }
    });
    setTimeout(() => {
      requestList.value = templeChat;
    }, 500);
  });
};

/**
 *  Handle add friend user
 * @param
 */
const handleAddUser = async (userAdded: TProfile) => {
  const documentGroupId = `${$state.profile?.id}-${userAdded.id}`;
  const dataAdd: TMessageGroup = {
    group_id: documentGroupId,
    group_type: "private",
    is_approved: false,
    last_message: {
      message_id: "message-private-0",
      user_id: $state.profile.id,
      user_ref: doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
      content: "Say Hello to start the conservation !",
      created_at: new Date().toString(),
    },
    admin_refs: [
      doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
    ],
    member_refs: [doc($firestore, `${FIRESTORE_PATH.user_collection}/${userAdded.id}`)],
    is_canceled: false,
  };
  try {
    await setDoc(
      doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId),
      dataAdd
    );
    console.log("Send Request Successfully");
  } catch (err) {
    console.error("Error add user: ", err);
  }
};

const handleApproveUser = async (userApproved: TProfile) => {
  const documentGroupId = `${userApproved.id}-${$state.profile?.id}`;

  try {
    await updateDoc(doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId), {
      is_approved: true,
    });
    console.log("Approve User Successfully");
  } catch (err) {
    console.error("Error approve user: ", err);
  }
};

const handleDenyUser = async (userDeleted: TProfile) => {
  try {
    const documentGroupId = `${userDeleted.id}-${$state.profile?.id}`;
    await updateDoc(doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId), {
      is_canceled: true,
    });
    console.log("Deny User Successfully");
  } catch (err) {
    console.error("Error deny user: ", err);
  }
};

const handleChatUser = async (dataUser: TProfile) => {
  try {
    const querySnapshot = await getDocs(
      collection($firestore, FIRESTORE_PATH.chat_collection)
    );
    querySnapshot.forEach(async (chatItem) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if (
        [adminProfile.id, memberProfile.id].includes(dataUser.id) &&
        [adminProfile.id, memberProfile.id].includes($state.profile.id)
      ) {
        const groupDetail = chatItem.data();
        const groupOppositeConvert = {
          ...groupDetail,
          oppositeUser:
            $state.profile.id === adminProfile.id
              ? (memberProfile.data() as TProfile)
              : (adminProfile.data() as TProfile),
        };
        navigatorTab.changeNavigatorTab({
          tab: "chats",
          group: groupOppositeConvert as TMessageGroup,
        });
      }
    });
  } catch (err) {
    console.error("Error navigate to Chat: ", err);
  }
};

watchEffect(() => {
  getAllUsers();
  getAllRequests();
});
</script>

<style lang="scss" scoped>
.user-panel-container {
  height: 100%;
}

.user-panel-container .user-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-panel-container .user-tab-container {
  height: 100%;
  margin-top: 20px;
}

.user-tab-container .user-panel-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  overflow: auto;
  padding: 2px 0px;
}

.user-panel-container .no-user-style {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.no-user-photo {
  width: 450px;
  height: 450px;
  object-fit: contain;
  background-image: url("/imgs/no-user.png");
  background-size: contain;
}
</style>
