export default defineNuxtPlugin(async () => {
  const local = ref<MediaStream>();
  const remote = ref<MediaStream>();
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

  const openVoice = async () => {
    try {
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
      local.value = localStream;
      remote.value = remoteStream;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    provide: {
      pc: pc,
      openVoice: openVoice,
      local: local,
      remote: remote,
      isCalling: isCalling,
    },
  };
});
