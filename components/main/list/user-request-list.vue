<template>
  <v-container class="user-request-container">
    <UserBox v-for="user in users" :key="user.id" :data-user="user" />
  </v-container>
</template>

<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const users = ref<TProfile[]>([]);

const getUserList = async () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    const existSelfTo: TMessageGroup[] = list_group?.filter(
      (e: TMessageGroup) => e.to.id === $state.profile?.id && !e.is_approved
    );
    users.value = existSelfTo?.map((e: TMessageGroup) => e.from);
  });
};

watchEffect(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.user-request-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-request-container .row {
  margin: 0;
  border: none;
}
</style>
