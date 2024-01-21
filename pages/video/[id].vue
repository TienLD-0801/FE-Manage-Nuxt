<template>
  <v-layout :fullHeight="true" v-if="!isCalling">
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
    <video class="video-local" :srcObject="localRef" autoPlay playsInline muted />
    <v-card class="video-remote">
      <video :srcObject="remoteRef" autoPlay playsInline />
    </v-card>
  </v-layout>

  <Control
    :is-receiver="videoCallId.split('-')[1] === self.$state.profile.id"
    :is-answer="isAnswer"
    :is-voice="isVoice"
    @on-answer="handleAnswer"
    @on-hangup="handleHangUp"
    @on-camera="openCamera"
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
  setDoc,
  updateDoc,
} from "firebase/firestore";
const { $firestore } = useNuxtApp();
const route = useRoute();
const { $state } = useNavigatorTabStore();
const self = useProfileStore();
const isAnswer = ref<boolean>(false);
const isVoice = ref<boolean>(false);
const videoCallId = computed(() => route.params.id.toString());
const localRef = ref<MediaStream | undefined>();
const remoteRef = ref<MediaStream | undefined>();
const isCalling = ref<boolean>();

const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};
const pc = new RTCPeerConnection(servers);

const openCamera = async () => {
  const localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  const remoteStream = new MediaStream();

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  localRef.value = localStream;
  remoteRef.value = remoteStream;

  if (route.query.status === "start") {
    const callDoc = doc(collection($firestore, "calls"), route.params.id.toString());
    const offerCandidates = collection(callDoc, "caller");
    const answerCandidates = collection(callDoc, "answerer");

    pc.onicecandidate = (event) => {
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });
  }
};

const handleAnswer = async () => {
  const callDoc = doc(collection($firestore, "calls"), route.params.id.toString());
  const offerCandidates = collection(callDoc, "caller");
  const answerCandidates = collection(callDoc, "answerer");

  pc.onicecandidate = (event) => {
    event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
  };

  const callData = (await getDoc(callDoc)).data();

  const offerDescription = callData?.offer;
  await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

  const answerDescription = await pc.createAnswer();
  await pc.setLocalDescription(answerDescription);

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
        pc.addIceCandidate(new RTCIceCandidate(data));
      }
    });
  });
  isAnswer.value = true;
  isCalling.value = true;
};

const handleHangUp = async () => {
  pc.close();
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
    isCalling.value = snapshot.data()?.is_approved as boolean;
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
