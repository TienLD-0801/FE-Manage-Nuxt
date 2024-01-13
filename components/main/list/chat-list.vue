<template>
  <v-list class="chat-list-container" item-props lines="three">
    <div class="no-chat-list" v-if="!chatListMapping.length">
      <p>Let's add friend to have happy conservations.</p>
      <div class="intro-chat" />
    </div>
    <ChatBox
      v-for="(item, i) in chatListMapping"
      :subMessage="item.last_message?.user_id === $state.profile?.id ? 'You — ' : ''"
      :name="`${item.oppositeUser?.firstName} ${item.oppositeUser?.lastName}`"
      :time="
        item.last_message.content.length
          ? convertTimeMessage(item.last_message.created_at)
          : convertTimeMessage(new Date().toString())
      "
      :avatar="String(item.oppositeUser?.avatar)"
      :last-message="
        item.last_message.content.length
          ? item.last_message?.content
          : 'Say Hello to start the conservation !'
      "
      :key="i"
      :value="item"
      @click="handleClickItemUser(item)"
      :activeItem="navigatorTab.$state.currentTab.group?.group_id === item.group_id"
    />
  </v-list>
</template>
<script lang="ts" setup>
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firebaseStore } = useNuxtApp();
const { $state } = useProfileStore();
const chatListMapping = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item: TMessageGroup) => {
  if (!item) return;
  navigatorTab.changeNavigatorTab({ tab: "chats", group: item });
};

const getListUserChat = () => {
  const qChats = query(
    collection($firebaseStore, FIRESTORE_PATH.chat_collection),
    where("is_approved", "==", true),
    where("is_canceled", "==", false)
  );

  onSnapshot(qChats, (doc) => {
    let tempListUserChat: TMessageGroup[] = [];

    doc.forEach((snapShotChat) => {
      if (snapShotChat.id.split("-").includes($state.profile?.id!)) {
        tempListUserChat.push({
          ...(snapShotChat.data() as TMessageGroup),
          oppositeUser:
            snapShotChat.data().sender.id === $state.profile?.id
              ? snapShotChat.data().receiver
              : snapShotChat.data().sender,
          last_message: snapShotChat.get("last_message"),
        });
      }
      chatListMapping.value = tempListUserChat.sort((a, b) => {
        const date1 = new Date(b.last_message.created_at);
        const date2 = new Date(a.last_message.created_at);
        return Number(date1) - Number(date2);
      });
    });
  });
};

watchEffect(() => {
  getListUserChat();
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
