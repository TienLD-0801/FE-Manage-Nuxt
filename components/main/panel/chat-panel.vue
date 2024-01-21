<template>
  <v-main class="main-panel-container chat-container">
    <MessageHeader @on-called="handleCalled" />
    <MessageList />
  </v-main>
</template>

<script lang="ts" setup>
import { addDoc, collection, doc, onSnapshot, setDoc } from "firebase/firestore";

const { $state } = useNavigatorTabStore();
const { $openVoice, $pc, $firestore } = useNuxtApp();
const self = useProfileStore();

const handleCalled = async () => {
  await $openVoice();
  const idCalled = `${self.$state.profile.id}-${$state.currentTab.group?.oppositeUser?.id}`;
  const callDoc = doc(collection($firestore, "calls"), idCalled);
  const offerCandidates = collection(callDoc, "caller");
  const answerCandidates = collection(callDoc, "answerer");

  $pc.onicecandidate = (event) => {
    event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
  };

  const offerDescription = await $pc.createOffer();
  await $pc.setLocalDescription(offerDescription);

  const offer = {
    sdp: offerDescription.sdp,
    type: offerDescription.type,
  };

  await setDoc(callDoc, { offer });

  onSnapshot(callDoc, (snapshot) => {
    const data = snapshot.data();
    if (!$pc.currentRemoteDescription && data?.answer) {
      const answerDescription = new RTCSessionDescription(data.answer);
      $pc.setRemoteDescription(answerDescription);
    }
  });

  onSnapshot(answerCandidates, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        const candidate = new RTCIceCandidate(change.doc.data());
        $pc.addIceCandidate(candidate);
      }
    });
  });

  navigateTo(`/video/${idCalled}`, {
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
.chat-container {
  margin: 0;
}
</style>
