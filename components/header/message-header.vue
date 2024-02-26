<template>
  <v-toolbar class="message-toolbar" density="compact">
    <div class="message-header-bar">
      <v-list-item
        :prepend-avatar="
          infoAnswerer || infoGroup
            ? route.query.type === 'private'
              ? infoAnswerer?.avatar
              : infoGroup?.avatar
            : DEFAULT_AVATAR
        "
        :title="
          infoAnswerer || infoGroup
            ? route.query.type === 'private'
              ? `${infoAnswerer?.firstName} ${infoAnswerer?.lastName}`
              : infoGroup?.group_name
            : ''
        "
        :subtitle="'Active now'"
      />
      <DrawerInfo @on-audio-called="handleCalled" @on-video-called="handleCalled" />
    </div>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { doc, getDoc } from "firebase/firestore";
import { DEFAULT_AVATAR } from "~/shared/constant/constant";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $firestore } = useNuxtApp();
const { updateAnswerCallerProfile } = useAnswerCallerProfile();
const infoAnswerer = ref<TProfile>({
  id: "",
  email: "",
  lastName: "",
  avatar: "",
  firstName: "",
  created_at: "",
  updated_at: "",
});
const infoGroup = ref<TMessageGroup>({
  group_id: "",
  description: "",
  group_type: "group",
  admin_refs: undefined,
  member_refs: undefined,
  last_message: {
    message_id: "",
    user_id: "",
    user_ref: undefined,
    content: "",
    datetime: "",
    created_at: 0,
  },
  is_canceled: false,
  is_approved: false,
});
const self = useProfileStore();
const route = useRoute();

const getProfileUserChat = async () => {
  const collection =
    route.query.type === "private"
      ? FIRESTORE_PATH.user_collection
      : FIRESTORE_PATH.chat_collection;
  const userInfo = await getDoc(
    doc($firestore, collection, route.query.answerer!.toString())
  );
  route.query.type === "private"
    ? (infoAnswerer.value = userInfo.data() as TProfile)
    : (infoGroup.value = userInfo.data() as TMessageGroup);
  updateAnswerCallerProfile(infoAnswerer.value);
};

watchEffect(() => {
  getProfileUserChat();
});

const handleCalled = async () => {
  const idCalled = `${self.$state.profile.id}-${route.query.answerer!.toString()}`;
  navigateTo(`/video/${idCalled}?status=start`, {
    open: {
      target: "_blank",
      windowFeatures: {
        width: 900,
        height: 650,
        left: (window.innerWidth - 900) / 2,
        top: (window.innerHeight - 600) / 2,
        popup: true,
      },
    },
  });
};
</script>

<style lang="scss" scoped>
.message-toolbar {
  height: 65px;
  border-bottom: 1px solid rgb(208, 208, 208);
  display: flex;
  justify-content: center;
  padding: 0px 20px;
}
.message-toolbar .message-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
