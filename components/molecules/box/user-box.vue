<template>
  <v-col cols="auto">
    <v-card
      class="mx-auto"
      width="300"
      :title="`${dataUser.firstName} ${dataUser.lastName}`"
      :subtitle="dataUser.email"
    >
      <template v-slot:prepend>
        <v-avatar :image="dataUser.avatar" />
      </template>
      <template v-slot:append>
        <v-icon
          @click="handleConnectUser"
          :icon="status.icon"
          :color="status.color"
        ></v-icon>
      </template>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
const props = defineProps<{
  dataUser: TProfile;
}>();
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
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

const handleConnectUser = async () => {
  const data = {
    from: $state.profile,
    to: dataUser,
    is_approved: false,
    data: [],
  };

  switch (status.value.icon) {
    case ConnectUserStatus.NewConnect:
      await updateDoc(doc($firebaseStore, "messages", "message_group"), {
        list_group: arrayUnion(data),
      });
      break;
    case ConnectUserStatus.WaitApprove:
      await updateDoc(doc($firebaseStore, "messages", "message_group"), {
        list_group: arrayUnion({
          ...data,
          is_approved: true,
        }),
      });
      break;
    default:
      break;
  }
};

watchEffect(() => {
  getFriendStatus();
});
</script>

<style lang="scss" scoped></style>
