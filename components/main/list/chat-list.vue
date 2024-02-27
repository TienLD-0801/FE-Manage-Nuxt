<template>
  <v-list class="chat-list-container" item-props lines="three">
    <div class="no-chat-list" v-if="!chatListMapping.length">
      <p>Let's add friend to have happy conservations.</p>
      <div class="intro-chat">
        <video autoplay loop muted playsinline width="100%" height="100%">
          <source src="/imgs/chat-intro.mp4" type="video/mp4" />
        </video>
      </div>
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
      :activeItem="$route.params.id === item.group_id"
    />
  </v-list>
</template>
<script lang="ts" setup>
import { collection, doc, getDoc, onSnapshot, query, where, type DocumentData, DocumentReference } from "firebase/firestore";
import { DEFAULT_AVATAR_GROUP } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
import { PATH_ROUTER } from "~/shared/constant/router";
const { updateGroup } = useGroupStore();
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
  let id = item.group_id;
  id =
    item.group_id.split("-")[0] === $state.profile.id
      ? item.group_id.split("-")[1]
      : item.group_id.split("-")[0];
  getGroupInfo(item.group_id);
  navigateTo(
    `${PATH_ROUTER.message}/${item.group_id}?type=${item.group_type}&answerer=${id}`
  );
};

const getGroupInfo = async (id: string) => {
  const infoGroup = await getDoc(doc($firestore, FIRESTORE_PATH.chat_collection, id));
  updateGroup(infoGroup.data() as TMessageGroup);
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
        chatItem.data().admin_refs.forEach(async (ref: DocumentReference<unknown, DocumentData>) => {
          const adminItem = await getDoc(ref);
          adminList.push(adminItem.data() as TProfile);
        });
        const memberList: TProfile[] = [];
        chatItem.data().member_refs.forEach(async (ref: DocumentReference<unknown, DocumentData>) => {
          const memberItem = await getDoc(ref);
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
  padding: 0px;
  margin-top: 20px;
}

.chat-list-container .no-chat-list {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.chat-list-container .intro-chat {
  width: 80%;
  height: 80%;
  background-size: contain;
}
</style>
