<template>
  <v-card
    width="320"
    :title="`${dataUser.firstName} ${dataUser.lastName}`"
    :subtitle="dataUser.email"
  >
    <template v-slot:prepend>
      <v-avatar :image="dataUser.avatar" />
    </template>
    <template v-slot:append>
      <div class="icons-frame">
        <v-icon
          v-if="status.icon === ConnectUserStatus.SentRequest"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.ConnectApproved"
          @click="handleChatWithUser"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.NewConnect"
          @click="handleAddUser"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.WaitApprove"
          @click="handleApproveUser"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.WaitApprove"
          @click="handleDenyUser"
          icon="mdi-close"
          color="error"
        ></v-icon>
      </div>
    </template>
  </v-card>
</template>

<script lang="ts" setup>
const props = defineProps<{
  dataUser: TProfile;
}>();
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const { dataUser } = props;
enum ConnectUserStatus {
  NewConnect = "mdi-account-plus-outline",
  SentRequest = "mdi-cube-send",
  WaitApprove = "mdi-check",
  ConnectApproved = "mdi-chat-outline",
}

const status = ref({
  icon: ConnectUserStatus.NewConnect,
  color: "success",
});

const getFriendStatus = () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    const existSelfFrom: TMessageGroup = list_group?.find(
      (e: TMessageGroup) => e.from.id === $state.profile?.id && e.to.id === dataUser.id
    );

    const existSelfTo: TMessageGroup = list_group?.find(
      (e: TMessageGroup) => e.from.id === dataUser.id && e.to.id === $state.profile?.id
    );

    if (existSelfFrom?.is_approved || existSelfTo?.is_approved) {
      status.value = {
        icon: ConnectUserStatus.ConnectApproved,
        color: "primary",
      };
    } else if (existSelfFrom && !existSelfFrom?.is_approved) {
      status.value = {
        icon: ConnectUserStatus.SentRequest,
        color: "grey",
      };
    } else if (existSelfTo && !existSelfTo?.is_approved) {
      status.value = {
        icon: ConnectUserStatus.WaitApprove,
        color: "primary",
      };
    } else {
      status.value = {
        icon: ConnectUserStatus.NewConnect,
        color: "success",
      };
    }
  });
};

const handleChatWithUser = () => {
  // handle later
};

const handleAddUser = async () => {
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

const handleApprovedUser = async () => {
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

const handleDenyUser = async () => {
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

watchEffect(() => {
  getFriendStatus();
});
</script>

<style lang="scss" scoped>
.icons-frame {
  display: flex;
  gap: 5px;
}

.icons-frame .icon {
  width: 30px;
  height: 30px;
  &:hover {
    opacity: 0.8;
    border: 1px solid rgb(193, 193, 193);
    border-radius: 50px;
  }
}
</style>
