<template>
  <v-container class="user-container">
    <v-row align="center">
      <UserBox
        v-for="user in requestUserStore.$state.requestUser"
        :key="user.from?.id"
        :data-user="user.from"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const requestUserStore = useRequestUserStore();

const getUserList = async () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    const requestListConvert: TMessageGroup[] = list_group?.filter(
      (user: TMessageGroup) => user.to?.id === $state.profile?.id && !user.is_approved
    );
    requestUserStore.updateRequestUser(requestListConvert);
  });
};

watchEffect(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.user-container {
  display: flex;
  justify-content: center;
}
</style>
