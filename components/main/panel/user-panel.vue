<template>
  <v-main class="main-panel-container">
    <h2>Users</h2>
    <v-container class="user-container">
      <div class="user-box">
        <v-row align="center">
          <UserBox
            v-for="user in users"
            :id="user.id"
            :key="user.id"
            :name="`${user.firstName} ${user.lastName}`"
            :email="user.email"
            :avatar="user.avatar"
            @on-click="handleAddFriend(user)"
          />
        </v-row>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const users = ref<TProfile[]>([]);

const getUserList = async () => {
  onSnapshot(doc($firebaseStore, "users", "user_system"), (doc) => {
    const { list_user } = doc.data()!;
    users.value = list_user.filter((user: TProfile) => {
      return user.id !== $state.profile?.id;
    });
  });
};

const handleAddFriend = async (item: TProfile) => {
  await updateDoc(doc($firebaseStore, "messages", "message_group"), {
    list_group: arrayUnion({
      from: $state.profile,
      to: item,
      is_approved: false,
      data: [],
    }),
  });
};

watchEffect(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.user-container {
  height: 100%;
  display: flex;
  justify-content: center;
}
</style>
