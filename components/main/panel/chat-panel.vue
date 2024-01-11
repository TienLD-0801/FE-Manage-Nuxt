<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader
      :name="`${navigatorTab.$state.currentTab.group?.oppositeUser?.firstName} ${navigatorTab.$state.currentTab.group?.oppositeUser?.lastName}`"
      :avatar="navigatorTab.$state.currentTab.group?.oppositeUser?.avatar || ''"
    />
    <MessageList :message-list="messageList" />
    <MessageInput
      v-model="message"
      @on-clear-message="clearMessage"
      @on-send-message="sendMessage"
    />
  </v-main>
</template>

<script lang="ts" setup>
import { arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

// const { $state } = useChatProfileStore();
const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const message = ref<string>("");
const messageList = ref<TMessage[]>([]);
const { $firebaseStore } = useNuxtApp();

const sendMessage = async () => {
  if (!message.value.trim().length) {
    return;
  }
  const documentGroupId = `${navigatorTab.$state.currentTab.group?.sender.id}-${navigatorTab.$state.currentTab.group?.receiver.id}`;
  const dataMessage = {
    message_id: (Math.random() * 123456789).toFixed(0).toString(),
    user_id: $state.profile?.id,
    content: message.value,
    created_at: new Date().toString(),
  };

  try {
    await updateDoc(
      doc($firebaseStore, FIRESTORE_PATH.chat_collection, documentGroupId),
      {
        messages: arrayUnion(dataMessage),
      }
    );
    console.log("send message success");
  } catch (error) {
    console.log("send message Error: ", error);
  }
  clearMessage();
};

const clearMessage = () => {
  message.value = "";
};

const getAllMessage = async () => {
  const documentGroupId = `${navigatorTab.$state.currentTab.group?.sender.id}-${navigatorTab.$state.currentTab.group?.receiver.id}`;
  try {
    onSnapshot(
      doc($firebaseStore, FIRESTORE_PATH.chat_collection, documentGroupId),
      (doc) => {
        messageList.value = doc.data()?.messages.reverse();
      }
    );
  } catch (error) {}
};

watchEffect(() => {
  getAllMessage();
});
</script>

<style lang="scss" scoped>
.chat-container {
  margin: 0px 0px 0px 100px;
}
</style>
