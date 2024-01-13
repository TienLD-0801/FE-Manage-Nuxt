<template>
  <v-infinite-scroll
    height="100%"
    side="end"
    @load="load"
    id="message-list-scroll"
    class="message-scroll"
  >
    <MessageBox
      v-for="item in messageList"
      :key="item.message_id"
      :content="item.content"
      :time="item.created_at"
      :isSelf="item.user_id === $state.profile?.id"
    />
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
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { MESSAGE_LIMIT } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const messageList = ref<TMessage[]>([]);
const { $firebaseStore } = useNuxtApp();
const message = ref<string>("");
const { setScroll } = useScroll();
const detectNewMessage = ref(false);
const page = ref(0);

const getAllMessage = async () => {
  const documentGroupId = `${navigatorTab.$state.currentTab.group?.sender.id}-${navigatorTab.$state.currentTab.group?.receiver.id}`;
  const messageCollection = collection(
    $firebaseStore,
    FIRESTORE_PATH.chat_collection,
    documentGroupId,
    FIRESTORE_PATH.message_collection
  );

  console.log("page.value: ", page.value);

  if (page.value > 0) {
    const first = query(
      messageCollection,
      orderBy("created_at", "desc"),
      limit(MESSAGE_LIMIT * page.value)
    );
    const documentSnapshots = await getDocs(first);
    const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];

    const q = query(
      messageCollection,
      orderBy("created_at", "desc"),
      startAfter(lastVisible),
      limit(MESSAGE_LIMIT)
    );

    onSnapshot(q, (doc) => {
      let tempSnapshot: TMessage[] = [];
      doc.forEach((snapshot) => {
        tempSnapshot.push(snapshot.data() as TMessage);
      });
      messageList.value = [...messageList.value, ...tempSnapshot];
    });
  } else {
    const q = query(
      messageCollection,
      orderBy("created_at", "desc"),
      limit(MESSAGE_LIMIT)
    );

    onSnapshot(q, (doc) => {
      let tempSnapshot: TMessage[] = [];
      doc.forEach((snapshot) => {
        tempSnapshot.push(snapshot.data() as TMessage);
      });
      messageList.value = [...messageList.value, ...tempSnapshot];
    });
  }
  page.value = page.value + 1;
};

const load = ({ done }: any) => {
  console.log("Scrolling to load");
  if (page.value === 0) {
    getAllMessage();
    done("ok");
  } else {
    setTimeout(async () => {
      await getAllMessage();
      done("ok");
    }, 1000);
  }
};

const sendMessage = async () => {
  if (!message.value.trim().length) {
    return;
  }
  detectNewMessage.value = true;
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
    user_id: $state.profile?.id || "",
    content: message.value,
    created_at: new Date().toString(),
  };

  try {
    messageList.value = [dataMessage, ...messageList.value];
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
  } finally {
    detectNewMessage.value = false;
    clearMessage();
  }
};

const clearMessage = () => {
  message.value = "";
};

watch(detectNewMessage, () => {
  setScroll("message-list-scroll", 0, "instant");
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
