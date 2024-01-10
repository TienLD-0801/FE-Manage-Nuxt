<template>
  <v-main class="user-panel-container main-panel-container">
    <h2>Users</h2>
    <div class="user-panel-list">
      <UserBox v-for="user in users" :key="user.id" :data-user="user" />
    </div>
  </v-main>
</template>

<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const users = ref<TProfile[]>([]);

const getUserList = async () => {
  onSnapshot(doc($firebaseStore, "users", "user_system"), (doc) => {
    const { list_user } = doc.data()!;
    users.value = list_user?.filter((user: TProfile) => {
      return user.id !== $state.profile?.id;
    });
  });
};

watchEffect(() => {
  getUserList();
});
</script>

<style lang="scss" scoped>
.user-panel-container {
  height: 100%;
}

.user-panel-container .user-panel-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
</style>
