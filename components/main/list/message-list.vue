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
</template>
<script setup lang="ts">
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { MESSAGE_LIMIT } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const messageList = ref<TMessage[]>([]);
const { $firebaseStore } = useNuxtApp();
const { setScroll } = useScroll();

const getAllMessage = async () => {
  const documentGroupId = `${navigatorTab.$state.currentTab.group?.sender.id}-${navigatorTab.$state.currentTab.group?.receiver.id}`;
  const q = query(
    collection(
      $firebaseStore,
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
  done("ok");
};

watch(messageList, () => {
  setScroll("message-list-scroll", 0, "instant");
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
