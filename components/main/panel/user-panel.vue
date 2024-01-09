<template>
  <v-main class="main-panel-container">
    <h2>Users</h2>
    <v-container class="user-container">
      <div class="user-box">
        <v-row align="center" justify="center">
          <v-col cols="auto" v-for="(item, i) in users" :key="i">
            <v-card
              class="mx-auto"
              max-width="300"
              :title="`${item.firstName} ${item.lastName}`"
              :subtitle="item.email"
            >
              <template v-slot:prepend>
                <v-avatar :image="item.avatar" />
              </template>
              <template v-slot:append>
                <v-icon
                  @click="handleAddFriend(item)"
                  icon="mdi-account-plus-outline"
                  color="success"
                ></v-icon>
              </template>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup>
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const users = ref<ProfileType[]>([]);

const getUserList = async () => {
  onSnapshot(doc($firebaseStore, "users", "user_system"), (doc) => {
    const { list_user } = doc.data()!;
    users.value = list_user.filter((user: ProfileType) => user.id !== $state.profile?.id);
  });
};

const handleAddFriend = async (item: ProfileType) => {
  await updateDoc(doc($firebaseStore, "messages", "message_group"), {
    list_group: arrayUnion({
      from: $state.profile,
      to: item,
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
