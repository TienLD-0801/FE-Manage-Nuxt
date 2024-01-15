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
      :time="convertTimeMessage(item.last_message.created_at)"
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
import { collection, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firestore } = useNuxtApp();
const { $state } = useProfileStore();
const chatListMapping = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item: TMessageGroup) => {
  if (!item) return;
  navigatorTab.changeNavigatorTab({ tab: "chats", group: item });
};

const getListUserChat = () => {
  const qChats = query(
    collection($firestore, FIRESTORE_PATH.chat_collection),
    where("is_approved", "==", true),
    where("is_canceled", "==", false),
    where("group_type", "==", "private")
  );

  onSnapshot(qChats, (chatList) => {
    let tempListUserChat: TMessageGroup[] = [];
    chatList.forEach(async (chatItem) => {
      const adminRef = chatItem.data().admin_refs[0];
      const memberRef = chatItem.data().member_refs[0];
      const [adminProfile, memberProfile] = await Promise.all([
        getDoc(adminRef),
        getDoc(memberRef),
      ]);
      if ([adminProfile.id, memberProfile.id].includes($state.profile.id)) {
        tempListUserChat.push({
          ...(chatItem.data() as TMessageGroup),
          oppositeUser:
            $state.profile.id === adminProfile.id
              ? (memberProfile.data() as TProfile)
              : (adminProfile.data() as TProfile),
          last_message: chatItem.get("last_message"),
        });
      }
    });
    setTimeout(() => {
      chatListMapping.value = tempListUserChat.sort((a, b) => {
        const date1 = new Date(b.last_message.created_at);
        const date2 = new Date(a.last_message.created_at);
        return Number(date1) - Number(date2);
      });
    }, 500);
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
