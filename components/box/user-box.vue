<template>
  <v-skeleton-loader
    width="350"
    height="80"
    class="user-box-container"
    :loading="isSkeleton"
    type="list-item-avatar"
  >
    <v-card
      width="350"
      height="80"
      :title="`${user.firstName} ${user.lastName}`"
      :subtitle="user.email"
    >
      <template v-slot:prepend>
        <v-avatar :image="user.avatar" />
      </template>
      <template v-slot:append>
        <div class="icons-frame">
          <v-icon
            v-if="status === ConnectUserStatus.SentRequest"
            :icon="ConnectUserStatus.SentRequest"
            color="grey"
          ></v-icon>
          <v-icon
            class="icon"
            v-if="status === ConnectUserStatus.NewConnect"
            @click="$emit('on-add-user', user)"
            :icon="ConnectUserStatus.NewConnect"
            color="success"
          ></v-icon>
          <v-icon
            class="icon"
            v-if="status === ConnectUserStatus.WaitApprove"
            @click="$emit('on-approve-user', user)"
            :icon="ConnectUserStatus.WaitApprove"
            color="primary"
          ></v-icon>
          <v-icon
            class="icon"
            v-if="status === ConnectUserStatus.WaitApprove"
            @click="$emit('on-deny-user', user)"
            icon="mdi-close"
            color="error"
          ></v-icon>
          <v-icon
            class="icon"
            v-if="status === ConnectUserStatus.ConnectApproved"
            @click="$emit('on-chat-user', user)"
            :icon="ConnectUserStatus.ConnectApproved"
            color="primary"
          ></v-icon>
        </div>
      </template>
    </v-card>
  </v-skeleton-loader>
</template>

<script lang="ts" setup>
import { collection, onSnapshot, query } from "firebase/firestore";
import { ConnectUserStatus } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const props = defineProps<{
  user: TProfile;
  isSkeleton: boolean;
}>();
const { user } = props;
const { $state } = useProfileStore();
const { $firestore } = useNuxtApp();
const status = ref<ConnectUserStatus>(ConnectUserStatus.NewConnect);

const getFriendStatus = () => {
  const q = query(collection($firestore, FIRESTORE_PATH.chat_collection));
  onSnapshot(q, (snapShot) => {
    snapShot.forEach((doc) => {
      if ($state.profile?.id && !doc.id.split("-").includes($state.profile.id)) {
        return;
      }
      if (doc.id.split("-").includes(user.id) && doc.data().is_canceled) {
        status.value = ConnectUserStatus.NewConnect;
      } else if (doc.id.split("-").includes(user.id) && doc.data().is_approved) {
        status.value = ConnectUserStatus.ConnectApproved;
      } else if (doc.id.split("-")[0] === user.id) {
        status.value = ConnectUserStatus.WaitApprove;
      } else if (doc.id.split("-")[1] === user.id && !!doc.data()) {
        status.value = ConnectUserStatus.SentRequest;
      }
    });
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
