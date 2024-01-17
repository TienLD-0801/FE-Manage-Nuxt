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
      v-for="(item, i) in messageList"
      :key="item.message_id"
      :content="item.content"
      :profile="getProfileDetail(item.user_id)"
      :time="item.created_at"
      :isSelf="item.user_id === $state.profile.id"
      :notShowAvatarAndName="
        i < messageList.length - 1 && item.user_id === messageList[i + 1].user_id
      "
      :notShowTime="i > 0 && item.user_id === messageList[i - 1].user_id"
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
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { DEFAULT_AVATAR, MESSAGE_LIMIT } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";

const { $state } = useProfileStore();
const navigatorTab = useNavigatorTabStore();
const messageList = ref<TMessage[]>([]);
const { $firestore } = useNuxtApp();
const adminsAndMembersProfiles = ref<TProfile[]>([]);

const message = ref<string>("");
const { scrollElementId, onSetScroll } = useElement();

const getProfileDetail = (userId: string) => {
  const tempProfile: TProfile[] = [];

  adminsAndMembersProfiles.value.some((e: TProfile) => {
    if (e.id === userId) {
      tempProfile.push(e);
    }
  });

  if (!tempProfile[0]) {
    return {
      id: "",
      email: "",
      lastName: "",
      avatar: DEFAULT_AVATAR,
      firstName: "",
      created_at: "",
      updated_at: "",
    };
  }

  return JSON.parse(JSON.stringify(tempProfile[0]));
};

const getAllProfileOfAdminsAndMembers = async () => {
  const tempProfiles: TProfile[] = [];
  const documentGroupId = navigatorTab.$state.currentTab.group?.group_id!;
  const q = doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId);
  const adminAndMemberRef = await getDoc(q);
  const listRefs = [
    ...adminAndMemberRef.data()?.admin_refs,
    ...adminAndMemberRef.data()?.member_refs,
  ];
  listRefs.forEach(async (e, index) => {
    const profileRefDetail: any = await getDoc(e);
    tempProfiles.push(profileRefDetail.data());

    if (index === listRefs.length - 1) {
      adminsAndMembersProfiles.value = tempProfiles;
    }
  });
};

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
    user_ref: doc($firestore, `${FIRESTORE_PATH.user_collection}/${$state.profile.id}`),
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
  getAllProfileOfAdminsAndMembers();
});
</script>

<style lang="scss" scoped>
.message-scroll {
  flex-direction: column-reverse;
  height: 100vh;
  // gap: 20px;
  padding: 0 25px;
}
</style>
