<template>
  <v-layout :fullHeight="true" v-if="!$isCalling">
    <v-card class="calling-container">
      <v-avatar
        size="150"
        class="message-avatar"
        :image="$state.currentTab.group?.oppositeUser?.avatar"
      />
      <v-label
        :text="`${$state.currentTab.group?.oppositeUser?.firstName}${$state.currentTab.group?.oppositeUser?.lastName}`"
      />
      <v-label
        :text="`Connecting to the machine ${$state.currentTab.group?.oppositeUser?.firstName}${$state.currentTab.group?.oppositeUser?.lastName} ...`"
      />
    </v-card>
  </v-layout>
  <v-layout :fullHeight="true" v-else>
    <video class="video-local" :srcObject="$local" autoPlay playsInline muted />
    <v-card class="video-remote">
      <video :srcObject="$remote" autoPlay playsInline />
    </v-card>
  </v-layout>
  <Control
    :is-receiver="videoCallId.split('-')[1] === self.$state.profile.id"
    :is-answer="isAnswer"
    :is-voice="isVoice"
    @on-answer="handleAnswer"
    @on-voice="handleVoice"
    @on-hangup="handleHangUp"
  />
</template>
<script lang="ts" setup>
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
const { $firestore, $pc, $isCalling, $local, $remote, $openCamera } = useNuxtApp();
const route = useRoute();
const { $state } = useNavigatorTabStore();
const self = useProfileStore();

const isAnswer = ref<boolean>(false);
const isVoice = ref<boolean>(false);

const videoCallId = computed(() => route.params.id.toString());

const handleVoice = () => {
  if ($isCalling) return;
  isVoice.value = !isVoice.value;
};

const handleAnswer = async () => {
  const callDoc = doc(collection($firestore, "calls"), route.params.id.toString());
  const offerCandidates = collection(callDoc, "caller");
  const answerCandidates = collection(callDoc, "answerer");

  $pc.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
  };

  const callData = (await getDoc(callDoc)).data();

  const offerDescription = callData?.offer;
  await $pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await $pc.createAnswer();
  await $pc.setLocalDescription(answerDescription);

  const answer = {
    type: answerDescription.type,
    sdp: answerDescription.sdp,
  };

  await updateDoc(callDoc, { answer });

  await updateDoc(doc($firestore, "calls", route.params.id.toString()), {
    is_approved: true,
  });

  onSnapshot(offerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        let data = change.doc.data();
        $pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  isAnswer.value = true;
  $isCalling.value = true;
};

const handleHangUp = async () => {
  $openCamera();
  $pc.close();
  if (route.params.id.toString()) {
    let roomRef = doc($firestore, "calls", route.params.id.toString());
    await getDocs(collection(roomRef, "caller")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
    await getDocs(collection(roomRef, "answerer")).then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        deleteDoc(doc.ref);
      });
    });
    await deleteDoc(roomRef);
  }
  window.close();
};

const someoneConnecting = () => {
  const q = doc($firestore, "calls", route.params.id.toString());
  onSnapshot(q, (snapshot) => {
    $openCamera();
    $isCalling.value = snapshot.data()?.is_approved as boolean;
  });
};

watchEffect(() => {
  someoneConnecting();
});
</script>

<style lang="scss" scoped>
.video-local {
  width: 35%;
  border-radius: 8%;
  bottom: 50px;
  right: 30px;
  position: fixed;
  z-index: 10;
}

.video-remote {
  position: relative;
  height: 100vh;
  width: 100vw;
  z-index: 1;
}

.calling-container {
  padding: 50px;
  gap: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100vh;
}
</style>
