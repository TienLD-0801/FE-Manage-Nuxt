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
  const local = ref();
  const remote = ref();

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
    setTimeout(() => {
      remote.value = remoteStream;
      local.value = localStream;
    }, 500);
  };

  return {
    provide: {
      openCamera: openCamera,
      pc: pc,
      isCalling: isCalling,
      local: local,
      remote: remote,
    },
  };
});
