<template>
  <v-infinite-scroll
    height="100%"
    side="end"
    @load="load"
    ref="refInfiniteScroll"
    :items="messageList"
    :id="scrollElementId"
    class="message-scroll"
    :v-slot:empty="true"
  >
    <MessageBox
      v-for="(item, i) in messageList"
      :key="item.message_id"
      :content="item.content.toLowerCase().includes('lồn') ? 'l**' : item.content"
      :profile="getProfileDetail(item.user_id)"
      :time="item.datetime"
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
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
} from "firebase/firestore";
import { DEFAULT_AVATAR, MESSAGE_LIMIT } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { scrollElementId, onSetScroll } = useElement();
const { $state } = useProfileStore();

const message = ref<string>("");
const messageList = ref<TMessage[]>([]);
const route = useRoute();
const adminsAndMembersProfiles = ref<TProfile[]>([]);

const { $firestore } = useNuxtApp();
const refInfiniteScroll = ref<ComponentPublicInstance>();

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

const nextPage = async (id: string) => {
  const lastIndex = messageList.value[messageList.value.length - 1].created_at;
  const nextPage = query(
    collection(
      $firestore,
      FIRESTORE_PATH.chat_collection,
      id,
      FIRESTORE_PATH.message_collection
    ),
    orderBy("created_at", "desc"),
    startAfter(lastIndex),
    limit(MESSAGE_LIMIT)
  );
  const dataMessagePagination = await getDocs(nextPage);
  dataMessagePagination.forEach((pagination) => {
    messageList.value.push(pagination.data() as TMessage);
  });
};

const load = async ({ done }: any) => {
  const documentGroupId = route.params.id.toString();
  const count = collection(
    $firestore,
    FIRESTORE_PATH.chat_collection,
    documentGroupId,
    FIRESTORE_PATH.message_collection
  );
  const pageSize = (await getCountFromServer(count)).data().count;
  setTimeout(async () => {
    if (
      refInfiniteScroll.value?.$el.scrollTop === 0 ||
      messageList.value.length >= pageSize
    ) {
      done("empty");
    } else {
      console.log("call api");
      await nextPage(documentGroupId);
      done("ok");
    }
  }, 1200);
};

const sendMessage = async () => {
  if (!message.value.trim().length) {
    return;
  }
  const documentGroupId = route.params.id.toString();
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
    datetime: new Date().toString(),
    created_at: new Date().getTime(),
  };

  try {
    clearMessage();
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
  }
};

const clearMessage = () => {
  message.value = "";
};

const getAllMessage = () => {
  const documentGroupId = route.params.id.toString();
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

watch(messageList, () => {
  onSetScroll(0, "instant");
});

const getAllProfileOfAdminsAndMembers = async () => {
  const tempProfiles: TProfile[] = [];
  const documentGroupId = route.params.id.toString();
  const q = doc($firestore, FIRESTORE_PATH.chat_collection, documentGroupId);
  const adminAndMemberRef = await getDoc(q);
  const listRefs = [
    ...adminAndMemberRef.data()?.admin_refs,
    ...adminAndMemberRef.data()?.member_refs,
  ];
  listRefs.forEach(async (e, index) => {
    const profileRefDetail = await getDoc(e);
    tempProfiles.push(profileRefDetail.data() as TProfile);

    if (index === listRefs.length - 1) {
      adminsAndMembersProfiles.value = tempProfiles;
    }
  });
};

watchEffect(() => {
  getAllMessage();
  getAllProfileOfAdminsAndMembers();
});
</script>

<style lang="scss" scoped>
.message-scroll {
  flex-direction: column-reverse;
  height: 100%;
  padding: 0 25px;
  scrollbar-color: transparent transparent;
}
</style>
