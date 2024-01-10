<template>
  <v-main class="user-panel-container main-panel-container">
    <di class="user-panel-header">
      <h2>Users</h2>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
    </di>
    <v-tabs v-model="tab" color="primary" align-tabs="center">
      <v-tab value="all">All</v-tab>
      <v-tab value="requests"
        >Requests
        <v-badge
          color="red"
          :content="requestUserStore.$state.requestUser?.length"
          v-if="requestUserStore.$state.requestUser?.length"
      /></v-tab>
    </v-tabs>
    <v-window class="user-tab-container" v-model="tab">
      <v-window-item key="all" value="all">
        <div class="user-panel-list">
          <UserBox
            v-for="user in users"
            :key="user.id"
            :data-user="user"
            @on-add-user="handleAddUser(user)"
            @on-approve-user="handleApproveUser(user)"
            @on-deny-user="handleDenyUser(user)"
            @on-chat-user="handleChatUser(user)"
          />
          <v-container class="no-user-style" v-if="!users?.length">
            <p>No users here.</p>
            <v-img alt="no-user" src="../../../public/imgs/no-user.png" />
          </v-container>
        </div>
      </v-window-item>
      <v-window-item key="requests" value="requests">
        <div class="user-panel-list">
          <UserBox
            v-for="request in requestUserStore.$state.requestUser"
            :key="request.from?.id"
            :data-user="request.from"
            @on-approve-user="handleApproveUser(request.from)"
            @on-deny-user="handleDenyUser(request.from)"
          />
          <v-container
            class="no-user-style"
            v-if="!requestUserStore.$state.requestUser?.length"
          >
            <p>No users here.</p>
            <div class="no-user-photo" height="300" width="500" alt="no-user" />
          </v-container>
        </div>
      </v-window-item>
    </v-window>
  </v-main>
</template>

<script lang="ts" setup>
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const requestUserStore = useRequestUserStore();
const users = ref<TProfile[]>([]);
const tab = ref(null);

const getAllUsers = async () => {
  onSnapshot(doc($firebaseStore, "users", "user_system"), (doc) => {
    const { list_user } = doc.data()!;
    users.value = list_user?.filter((user: TProfile) => {
      return user.id !== $state.profile?.id;
    });
  });
};

const getAllRequests = async () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    const requestListConvert: TMessageGroup[] = list_group?.filter(
      (user: TMessageGroup) => user.to?.id === $state.profile?.id && !user.is_approved
    );
    requestUserStore.updateRequestUser(requestListConvert);
  });
};

const handleAddUser = async (dataUser: TProfile) => {
  const data = {
    group_id: `${$state.profile?.id + dataUser.id}`,
    from: $state.profile,
    to: dataUser,
    is_approved: false,
    data: [],
  };
  try {
    await updateDoc(doc($firebaseStore, "messages", "message_group"), {
      list_group: arrayUnion(data),
    });
    console.log("Send Request Successfully");
  } catch (err) {
    console.error("Error approve user: ", err);
  }
};

const handleApproveUser = async (dataUser: TProfile) => {
  const messageGroupList = await getDoc(doc($firebaseStore, "messages", "message_group"));
  const listGroupResponses = messageGroupList.data()?.list_group;
  const groupIdSelected = dataUser.id + $state.profile?.id;

  const groupSelected = listGroupResponses.find((group: TMessageGroup) => {
    return group.group_id === groupIdSelected;
  });

  const otherFilterGroups = listGroupResponses.filter((group: TMessageGroup) => {
    return group.group_id !== groupIdSelected;
  });

  try {
    await updateDoc(doc($firebaseStore, "messages", "message_group"), {
      list_group: [
        ...otherFilterGroups,
        {
          ...groupSelected,
          is_approved: true,
        },
      ],
    });
    console.log("Approve User Successfully");
  } catch (err) {
    console.error("Error approve user: ", err);
  }
};

const handleDenyUser = async (dataUser: TProfile) => {
  const messageGroupList = await getDoc(doc($firebaseStore, "messages", "message_group"));
  const listGroupResponses = messageGroupList.data()?.list_group;
  const groupIdSelected = dataUser.id + $state.profile?.id;

  const newListGroups = listGroupResponses.filter((group: TMessageGroup) => {
    return group.group_id !== groupIdSelected;
  });

  try {
    await updateDoc(doc($firebaseStore, "messages", "message_group"), {
      list_group: newListGroups,
    });
    console.log("Deny User Successfully");
  } catch (err) {
    console.error("Error approve user: ", err);
  }
};

const handleChatUser = (dataUser: TProfile) => {
  // handle later
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
