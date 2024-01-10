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
        <v-icon
          v-if="status.icon === ConnectUserStatus.WaitApprove"
          @click="handleDenyUser()"
          icon="mdi-close"
          color="error"
        ></v-icon>
      </template>
    </v-card>
  </v-col>
</template>

<script lang="ts" setup>
const props = defineProps<{
  dataUser: TProfile;
}>();
import { onValue } from "firebase/database";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
const { writeRealtimeDatabase, readRealtimeDatabase } = useFirebaseAuth();
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
const dataRealtime = ref<any>({});

const getFriendStatus = () => {
  const listenValue = readRealtimeDatabase();

  onValue(listenValue, (snapshot) => {
    const dataFrom = snapshot.child(`/group_${$state.profile?.id}${dataUser.id}`).val();
    const dataTo = snapshot.child(`/group_${dataUser.id}${$state.profile?.id}`).val();

    if (dataFrom) {
      dataRealtime.value = dataFrom;
    } else if (dataTo) {
      dataRealtime.value = dataTo;
    } else {
      return;
    }

    const isSelfFrom = Object.values(dataRealtime.value.members).find(
      (member: any) => member.role === "admin" && member.profile.id === $state.profile?.id
    );
    const isSelfTo = Object.values(dataRealtime.value.members).find(
      (member: any) =>
        member.role === "member" && member.profile.id === $state.profile?.id
    );

    if ((isSelfFrom || isSelfTo) && dataRealtime.value.is_approved) {
      status.value = {
        icon: ConnectUserStatus.NewConnect,
        color: "success",
      };
    } else if (isSelfFrom && !dataRealtime.value.is_approved) {
      status.value = {
        icon: ConnectUserStatus.SentRequest,
        color: "grey",
      };
    } else if (isSelfTo && !dataRealtime.value.is_approved) {
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

//delete
const handleDenyUser = async () => {};
const handleConnectUser = async () => {
  const data = {
    group_id: `${$state.profile?.id}${dataUser.id}`,
    members: {
      [`${$state.profile?.id}`]: {
        profile: $state.profile,
        role: "admin",
      },
      [`${dataUser.id}`]: {
        profile: dataUser,
        role: "member",
      },
    },
    messages: {
      [`${$state.profile?.id + dataUser.id}`]: {
        user_id: "",
        content: "",
        time: new Date().getTime(),
      },
    },
    is_approved: false,
  };

  switch (status.value.icon) {
    case ConnectUserStatus.NewConnect:
      writeRealtimeDatabase(`group_${$state.profile?.id + dataUser.id}`, data);
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
