<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader
      :name="fullName"
      :avatar="navigatorTab.$state.currentTab.group?.oppositeUser?.avatar || ''"
    />
    <MessageList />
    <MessageInput
      v-model="message"
      @on-clear-message="clearMessage"
      @on-send-message="sendMessage"
    />
  </v-main>
</template>

<script lang="ts" setup>
import { collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const message = ref<string>("");
const { $firebaseStore } = useNuxtApp();
const fullName = computed(() => {
  const firstName = navigatorTab.$state.currentTab.group?.oppositeUser?.firstName;
  const lastName = navigatorTab.$state.currentTab.group?.oppositeUser?.lastName;
  return `${firstName} ${lastName}`;
});

const sendMessage = async () => {
  if (!message.value.trim().length) {
    return;
  }
  const documentGroupId = navigatorTab.$state.currentTab.group?.group_id!;
  const messageKey = doc(
    collection(
      $firebaseStore,
      FIRESTORE_PATH.chat_collection,
      documentGroupId,
      FIRESTORE_PATH.message_collection
    )
  ).id;

  const dataMessage = {
    message_id: messageKey,
    user_id: $state.profile?.id,
    content: message.value,
    created_at: new Date().toString(),
  };

  try {
    await setDoc(
      doc(
        $firebaseStore,
        FIRESTORE_PATH.chat_collection,
        documentGroupId,
        FIRESTORE_PATH.message_collection,
        messageKey
      ),
      dataMessage
    );
    await updateDoc(
      doc($firebaseStore, FIRESTORE_PATH.chat_collection, documentGroupId),
      { last_message: dataMessage }
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
</script>

<style lang="scss" scoped>
.chat-container {
  margin: 0px 0px 0px 100px;
}
</style>
