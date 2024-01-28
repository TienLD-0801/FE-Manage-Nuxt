<template>
  <MainLayout />
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
import { collection, doc, getDoc, onSnapshot, query } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $firestore } = useNuxtApp();
const { $state, updateProfile } = useProfileStore();
const authStore = useAuthStore();
const navigatorTabStore = useNavigatorTabStore();
const listenCalled = ref<string>("");

const getUserDatabase = async () => {
  const userInfo = await getDoc(
    doc($firestore, FIRESTORE_PATH.user_collection, authStore.token?.localId!)
  );
  updateProfile(userInfo.data() as TProfile);
};

const someoneCalling = () => {
  const q = query(collection($firestore, "calls"));
  onSnapshot(q, (snapshot) => {
    let roomId: string = "";
    snapshot.docs.forEach((call) => {
      if (call.id.split("-")[1].includes($state.profile.id)) {
        roomId = call.id;
      }
    });
    listenCalled.value = roomId;
  });
};

watch(listenCalled, () => {
  if (listenCalled.value) {
    navigateTo(`/video/${listenCalled.value}`, {
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
  }
});

watchEffect(() => {
  someoneCalling();
  getUserDatabase();
  navigatorTabStore.changeNavigatorTab({ tab: "default" });
});
</script>

<style lang="scss" scoped></style>
