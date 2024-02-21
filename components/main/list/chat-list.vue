<template>
  <v-list class="chat-list-container" item-props lines="three">
    <div class="no-chat-list" v-if="!chatListMapping.length">
      <p>Let's add friend to have happy conservations.</p>
      <div class="intro-chat" />
    </div>
    <ChatBox
      v-for="(item, i) in chatListMapping"
      :subMessage="
        item.last_message.user_id === $state.profile.id
          ? 'You — '
          : item.group_type === 'private'
          ? ''
          : `${getLastName(item.last_message.user_id)} — `
      "
      :name="`${item.oppositeUser?.firstName} ${item.oppositeUser?.lastName}`"
      :time="convertTimeMessage(item.last_message.datetime)"
      :avatar="
        String(item.group_type === 'private' ? item.oppositeUser?.avatar : item.avatar)
      "
      :last-message="item.last_message?.content"
      :key="i"
      :value="item"
      @click="handleClickItemUser(item)"
      :activeItem="navigatorTab.$state.currentTab.group?.group_id === item.group_id"
    />
  </v-list>
</template>
<script lang="ts" setup>
import { collection, getDoc, onSnapshot, query, where } from "firebase/firestore";
import { DEFAULT_AVATAR_GROUP } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const navigatorTab = useNavigatorTabStore();
const { $firestore } = useNuxtApp();
const { $state } = useProfileStore();
const chatListMapping = ref<TMessageGroup[]>([]);
const lastProfileList = ref<TProfile[]>([]);

const getLastName = (userId: string) => {
  const templeProfile: TProfile[] = [];
  lastProfileList.value.some((user) => {
    if (user.id === userId) {
      templeProfile.push(JSON.parse(JSON.stringify(user)));
    }
  });
  if (!templeProfile[0]) return "";
  return templeProfile[0].lastName;
};

const handleClickItemUser = (item: TMessageGroup) => {
  if (!item) return;
  navigatorTab.changeNavigatorTab({ tab: "chats", group: item });
};

const getListUserChat = () => {
  const qChats = query(
    collection($firestore, FIRESTORE_PATH.chat_collection),
    where("is_approved", "==", true),
    where("is_canceled", "==", false)
  );

  onSnapshot(qChats, (chatList) => {
    let tempListUserChat: TMessageGroup[] = [];
    let tempProfileList: TProfile[] = [];
    chatList.forEach(async (chatItem) => {
      if (chatItem.data().group_type === "private") {
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
      } else {
        const adminList: TProfile[] = [];
        chatItem.data().admin_refs.forEach(async (e: any) => {
          const adminItem = await getDoc(e);
          adminList.push(adminItem.data() as TProfile);
        });
        const memberList: TProfile[] = [];
        chatItem.data().member_refs.forEach(async (e: any) => {
          const memberItem = await getDoc(e);
          memberList.push(memberItem.data() as TProfile);
        });
        const lastMessages = chatItem.get("last_message");
        setTimeout(async () => {
          if (
            [...adminList.map((e) => e.id), ...memberList.map((e) => e.id)].includes(
              $state.profile.id
            )
          ) {
            tempListUserChat.push({
              ...(chatItem.data() as TMessageGroup),
              oppositeUser: {
                id: chatItem.id,
                avatar: DEFAULT_AVATAR_GROUP,
                firstName: chatItem.data().group_name,
                lastName: "",
                created_at: "",
                email: "",
                updated_at: "",
              },
              last_message: lastMessages,
            });
            const profile = await getDoc(lastMessages.user_ref);
            tempProfileList.push(profile.data() as TProfile);
            lastProfileList.value = tempProfileList;
          }
        }, 500);
      }
    });

    setTimeout(() => {
      chatListMapping.value = tempListUserChat.sort((a, b) => {
        const date1 = new Date(b.last_message.datetime);
        const date2 = new Date(a.last_message.datetime);
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
