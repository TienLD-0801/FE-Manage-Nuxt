<template>
  <v-infinite-scroll
    height="100%"
    side="end"
    @load="load"
    :id="scrollElementId"
    class="message-scroll"
    :v-slot:empty="true"
  >
    <MessageBox
      v-for="item in messageList"
      :key="item.message_id"
      :content="item.content"
      :time="item.created_at"
      :isSelf="item.user_id === $state.profile.id"
    />
    <template v-slot:empty>
      <v-alert type="warning">No more messages!</v-alert>
    </template>
  </v-infinite-scroll>
  <MessageInput
    v-model="message"
    @on-clear-message="clearMessage"
    @on-send-message="sendMessage"
  />
</template>
<script setup lang="ts">
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { MESSAGE_LIMIT } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const messageList = ref<TMessage[]>([]);
const { $firestore } = useNuxtApp();

const message = ref<string>("");
const { scrollElementId, onSetScroll } = useElement();

const getAllMessage = async () => {
  const documentGroupId = navigatorTab.$state.currentTab.group?.group_id!;
  const q = query(
    collection(
      $firestore,
      FIRESTORE_PATH.chat_collection,
      documentGroupId,
      FIRESTORE_PATH.message_collection
    ),
    orderBy("created_at", "desc"),
    limit(MESSAGE_LIMIT)
  );
  onSnapshot(q, (doc) => {
    let tempSnapshot: TMessage[] = [];
    doc.forEach((snapshot) => {
      tempSnapshot.push(snapshot.data() as TMessage);
    });
    messageList.value = tempSnapshot;
  });
};

const load = async ({ done }: any) => {
  console.log("Scrolling to load");
  setTimeout(() => {
    done("empty");
  }, 1000);
};

const sendMessage = async () => {
  if (!message.value.trim().length) {
    return;
  }
  const documentGroupId = navigatorTab.$state.currentTab.group?.group_id!;
  const messageKey = doc(
    collection(
      $firestore,
      FIRESTORE_PATH.chat_collection,
      documentGroupId,
      FIRESTORE_PATH.message_collection
    )
  ).id;

  const dataMessage = {
    message_id: messageKey,
    user_id: $state.profile.id,
    content: message.value,
    created_at: new Date().toString(),
  };

  try {
    messageList.value = [dataMessage, ...messageList.value];
    await setDoc(
      doc(
        $firestore,
        FIRESTORE_PATH.chat_collection,
        documentGroupId,
        FIRESTORE_PATH.message_collection,
        messageKey
      ),
      dataMessage
    );
    await updateDoc(doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId), {
      last_message: dataMessage,
    });
    console.log("send message success");
  } catch (error) {
    console.log("send message Error: ", error);
  } finally {
    clearMessage();
  }
};

const clearMessage = () => {
  message.value = "";
};

watch(messageList, () => {
  onSetScroll(0, "instant");
});

watchEffect(() => {
  getAllMessage();
});
</script>

<style lang="scss" scoped>
.message-scroll {
  flex-direction: column-reverse;
  height: 100vh;
  gap: 20px;
  padding: 0 25px;
}
</style>
