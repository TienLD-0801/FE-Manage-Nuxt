<template>
  <v-list class="chat-list-container" item-props lines="three">
    <div class="no-chat-list" v-if="!chatListMapping.length">
      <p>Let's add friend to have happy conservations.</p>
      <div class="intro-chat" />
    </div>
    <ChatBox
      v-for="(item, i) in chatListMapping"
      :name="`${item.oppositeUser?.firstName} ${item.oppositeUser?.lastName}`"
      time="20:09"
      :avatar="String(item.oppositeUser?.avatar)"
      :last-message="getLastMessage"
      :key="i"
      :value="item"
      @click="handleClickItemUser(item?.oppositeUser)"
    />
  </v-list>
</template>
<script lang="ts" setup>
import { collection, onSnapshot, query } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const chatProfileStore = useChatProfileStore();
const chatListMapping = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item?: TProfile) => {
  if (!item) return;
  navigatorTab.changeNavigatorTab("chat");
  chatProfileStore.updateChatInfo(item);
};

const getListChat = () => {
  const q = query(collection($firebaseStore, FIRESTORE_PATH.chat_collection));
  onSnapshot(q, (snapShot) => {
    let tempRequest: TMessageGroup[] = [];
    snapShot.forEach((doc) => {
      if (doc.id.split("-").includes($state.profile?.id!) && doc.data().is_approved) {
        tempRequest.push(doc.data() as TMessageGroup);
      }
    });

    chatListMapping.value = tempRequest.map((e) => {
      return {
        ...e,
        oppositeUser: e.sender.id === $state.profile?.id ? e.receiver : e.sender,
      };
    });
  });
};

const getLastMessage = `Say ${"Hello"} to start the conservation !`;

watchEffect(() => {
  getListChat();
});
</script>

<style lang="scss" scoped>
.chat-list-container {
  padding-top: 0px !important;
}

.chat-list-container .no-chat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 15px !important;
}

.chat-list-container .intro-chat {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 250px;
  background-image: url("/imgs/chat-intro.gif");
  background-size: contain;
  margin-top: 20px;
}
</style>
