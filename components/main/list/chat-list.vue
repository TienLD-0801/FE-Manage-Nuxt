<template>
  <v-list class="chat-list-container" item-props lines="three">
    <div class="no-chat-list" v-if="!chatListMapping.length">
      <p>Let's add friend to have happy conservations.</p>
      <div class="intro-chat" />
    </div>
    <ChatBox
      :subMessage="getLastMessage(item.messages).subMessage"
      v-for="(item, i) in chatListMapping"
      :name="`${item.oppositeUser?.firstName} ${item.oppositeUser?.lastName}`"
      time="20:09"
      :avatar="String(item.oppositeUser?.avatar)"
      :last-message="getLastMessage(item.messages).lastMessage"
      :key="i"
      :value="item"
      @click="handleClickItemUser(item)"
      :activeItem="
        `${navigatorTab.$state.currentTab.group?.sender.id}-${navigatorTab.$state.currentTab.group?.receiver.id}` ===
        `${item.sender.id}-${item.receiver.id}`
      "
    />
  </v-list>
</template>
<script lang="ts" setup>
import { collection, onSnapshot, query } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const chatListMapping = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item: TMessageGroup) => {
  if (!item) return;
  navigatorTab.changeNavigatorTab({ tab: "chats", group: item });
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

const getLastMessage = (messagesList: TMessage[]) => {
  let noMessage = {
    lastMessage: `Say ${"Hello"} to start the conservation !`,
    subMessage: "",
  };
  console.log("messagesList: ", messagesList);
  if (messagesList.length) {
    if (messagesList[messagesList.length - 1].user_id === $state.profile?.id) {
      noMessage = {
        lastMessage: messagesList[messagesList.length - 1].content,
        subMessage: "You — ",
      };
    } else {
      noMessage = {
        lastMessage: messagesList[messagesList.length - 1].content,
        subMessage: "",
      };
    }
  }
  return noMessage;
};

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
