export default defineNuxtPlugin(async () => {
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

  let local: MediaStream | undefined;
  let remote: MediaStream | undefined;

  const openVoice = async () => {
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: false,
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
      local = localStream;
      remote = remoteStream;
    } catch (error) {
      console.log(error);
    }
  };

  const turnOffVoice = () => {
    //handle sau
    local = undefined;
  };

  return {
    provide: {
      pc: pc,
      openVoice: openVoice,
      local: local!,
      remote: remote!,
      turnOffVoice: turnOffVoice,
    },
  };
});
