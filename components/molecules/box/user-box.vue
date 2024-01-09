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
          :icon="iconStatus"
          :color="
            iconStatus === 'mdi-cube-send'
              ? 'grey'
              : iconStatus === 'mdi-account-plus-outline'
              ? 'success'
              : 'primary'
          "
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
const iconStatus = ref("mdi-account-plus-outline");

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
      iconStatus.value = "mdi-chat-outline";
    } else if (existSelfFrom && !existSelfFrom?.is_approved) {
      iconStatus.value = "mdi-cube-send";
    } else if (existSelfTo && !existSelfTo?.is_approved) {
      iconStatus.value = "mdi-check";
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

  switch (iconStatus.value) {
    case "mdi-account-plus-outline":
      await updateDoc(doc($firebaseStore, "messages", "message_group"), {
        list_group: arrayUnion(data),
      });
      break;
    case "mdi-check":
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
