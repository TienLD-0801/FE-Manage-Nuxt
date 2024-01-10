<template>
  <v-list class="chat-list-container" item-props lines="three">
    <ChatBox
      v-for="(item, i) in listChatUsers"
      :name="`${item.to.firstName} ${item.to.lastName}`"
      time="20:09"
      :avatar="item.to.avatar"
      :last-message="getLastMessage"
      :key="i"
      :value="item"
      @click="handleClickItemUser(item.to)"
    />
  </v-list>
</template>
<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const chatProfileStore = useChatProfileStore();
const listChatUsers = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item: TProfile) => {
  navigatorTab.changeNavigatorTab("chat");
  chatProfileStore.updateChatInfo(item);
};

const getListChat = () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    listChatUsers.value = list_group?.filter((group: TMessageGroup) => {
      return (
        $state.profile?.id &&
        [group.from.id, group.to.id].includes($state.profile?.id) &&
        group.is_approved
      );
    });
  });
};

const getLastMessage = `Say ${"Hello"} to start the conservation !`;

watchEffect(() => {
  getListChat();
});
</script>

<style lang="scss" scoped></style>
