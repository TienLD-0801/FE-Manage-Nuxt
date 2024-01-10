<template>
  <v-card
    class="user-box-container"
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
          v-if="status.icon === ConnectUserStatus.NewConnect"
          @click="$emit('on-add-user', user)"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.WaitApprove"
          @click="$emit('on-approve-user', user)"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.WaitApprove"
          @click="$emit('on-deny-user', user)"
          icon="mdi-close"
          color="error"
        ></v-icon>
        <v-icon
          class="icon"
          v-if="status.icon === ConnectUserStatus.ConnectApproved"
          @click="$emit('on-chat-user', user)"
          :icon="status.icon"
          :color="status.color"
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

watchEffect(() => {
  getFriendStatus();
});
</script>

<style lang="scss" scoped>
.user-box-container {
  border: 1px solid rgb(232, 232, 232);
}

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
