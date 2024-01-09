<template>
  <v-col cols="auto">
    <v-card class="mx-auto" width="300" :title="name" :subtitle="email">
      <template v-slot:prepend>
        <v-avatar :image="avatar" />
      </template>
      <template v-slot:append>
        <v-icon
          @click="$emit('on-click')"
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
const props = defineProps({
  id: String,
  name: String,
  email: String,
  avatar: String,
});
import { doc, onSnapshot } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const { id } = props;

const iconStatus = ref("mdi-account-plus-outline");

const getFriendStatus = async () => {
  await onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    if (
      !list_group.map((e: TMessageGroup) => e.from.id).includes(id) &&
      !list_group.map((e: TMessageGroup) => e.to.id).includes(id)
    ) {
      iconStatus.value = "mdi-account-plus-outline";
      return;
    } else if (list_group.map((e: TMessageGroup) => e.from.id).includes(id)) {
      list_group.some((e: TMessageGroup) => {
        if (e.from.id === String(id) && e.to.id === $state.profile!.id) {
          if (e.is_approved) {
            iconStatus.value = "mdi-chat-outline";
          } else {
            iconStatus.value = "mdi-check";
          }
          return;
        }
      });
    } else if (list_group.map((e: TMessageGroup) => e.to.id).includes(id)) {
      list_group.some((e: TMessageGroup) => {
        if (e.from.id === $state.profile!.id && e.to.id === String(id)) {
          if (e.is_approved) {
            iconStatus.value = "mdi-chat-outline";
          } else {
            iconStatus.value = "mdi-cube-send";
          }
          return;
        }
      });
    } else {
      iconStatus.value = "mdi-account-plus-outline";
      return;
    }
  });
};

watchEffect(() => {
  getFriendStatus();
});
</script>

<style lang="scss" scoped></style>
