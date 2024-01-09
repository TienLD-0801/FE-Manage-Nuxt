<template>
  <v-card class="chat-list-container mx-auto" max-width="450">
    <v-list class="chat-list" item-props lines="three">
      <v-list-item
        v-for="(item, i) in listChatUsers"
        :key="i"
        :value="item"
        class="chat-item"
        color="primary"
        @click="handleClickItemUser(item.to)"
      >
        <div class="chat-frame">
          <v-avatar class="message-avatar" :image="item.to.avatar"></v-avatar>
          <div class="message-content">
            <div class="message-label">
              {{ `${item.to.firstName} ${item.to.lastName}` }}
              <span v-text="'time'" />
            </div>
            <p class="message-text">
              <span class="message-target" v-text="item.data" />
            </p>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script lang="ts" setup>
import { doc, onSnapshot } from "firebase/firestore";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const chatProfileStore = useChatProfileStore();
const listChatUsers = ref<GroupMessageType[]>([]);

const handleClickItemUser = (item: ProfileType) => {
  navigatorTab.changeNavigatorTab("chat");
  chatProfileStore.updateChatInfo(item);
};

const getListChat = () => {
  onSnapshot(doc($firebaseStore, "messages", "message_group"), (doc) => {
    const { list_group } = doc.data()!;
    listChatUsers.value = list_group.filter(
      (group: GroupMessageType) => group.from.id === $state.profile?.id
    );
  });
};

watchEffect(() => {
  getListChat();
});
</script>

<style lang="scss" scoped>
.chat-list-container .chat-list {
  padding-top: 0 !important;
}
.chat-list-container .chat-item {
  padding: 0 10px;
}

.chat-item .chat-frame {
  display: flex;
  gap: 15px;
  align-items: center;
}

.chat-frame .message-avatar {
  width: 40px;
  height: 40px;
}

.chat-frame .message-content {
  width: 100%;
  font-size: 0.9rem;
  border-bottom: 1px solid rgb(184, 183, 183);
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-content .message-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-label span {
  font-size: 0.7rem;
  color: rgb(139, 140, 142);
}

.message-content .message-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.message-text .message-target {
  color: rgb(58, 112, 200);
}
</style>
