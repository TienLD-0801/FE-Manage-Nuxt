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
const requestList = ref<TProfile[]>([]);
const navigatorTab = useNavigatorTabStore();
const getAllUsers = async () => {
  const qUsers = query(
    collection($firestore, FIRESTORE_PATH.user_collection),
    where("id", "!=", $state.profile?.id)
  );
  onSnapshot(qUsers, (onSnapShot) => {
    let templeAllUser: TProfile[] = [];
    onSnapShot.forEach((user) => {
      templeAllUser.push(user.data() as TProfile);
    });
    users.value = templeAllUser;
  });
};

const getAllRequests = () => {
  const q = query(collection($firestore, FIRESTORE_PATH.chat_collection));
  onSnapshot(q, (snapShot) => {
    let tempRequest: TProfile[] = [];
    snapShot.forEach((doc) => {
      if (
        doc.id.split("-")[1] === $state.profile?.id &&
        !doc.data().is_approved &&
        !doc.data().is_canceled
      ) {
        tempRequest.push(doc.data().sender);
      }
    });
    requestList.value = tempRequest;
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
    sender: $state.profile!,
    receiver: userAdded,
    is_approved: false,
    last_message: {
      user_id: "",
      content: "",
      created_at: new Date().toString(),
      message_id: "",
    },
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
    querySnapshot.forEach((doc) => {
      if (
        $state.profile?.id &&
        doc.id.split("-").includes(dataUser.id) &&
        doc.id.split("-").includes($state.profile.id)
      ) {
        const groupDetail = doc.data();
        const groupOppositeConvert = {
          ...groupDetail,
          oppositeUser:
            groupDetail.sender.id === $state.profile.id
              ? groupDetail.receiver
              : groupDetail.sender,
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
