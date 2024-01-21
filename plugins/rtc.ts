export default defineNuxtPlugin(async () => {
  const isCalling = ref<boolean>(false);
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const pc = new RTCPeerConnection(servers);

  return {
    provide: {
      pc: pc,
      isCalling: isCalling,
    },
  };
});
