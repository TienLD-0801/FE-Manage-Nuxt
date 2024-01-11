<template>
  <v-list class="chat-list" item-props lines="three">
    <ChatBox
      v-for="(item, i) in oppositeUser"
      :name="`${item.oppositeUser?.firstName} ${item.oppositeUser?.lastName}`"
      time="20:09"
      :avatar="item.oppositeUser?.avatar"
      :last-message="getLastMessage"
      :key="i"
      :value="item"
      @click="handleClickItemUser(item.oppositeUser!)"
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
const oppositeUser = ref<TMessageGroup[]>([]);

const handleClickItemUser = (item: TProfile) => {
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

    oppositeUser.value = tempRequest.map((e) => {
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
.chat-list-container .chat-list {
  padding-top: 0 !important;
}
</style>
