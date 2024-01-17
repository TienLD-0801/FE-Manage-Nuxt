<template>
  <v-container class="video-container">
    <div class="video-frame">
      <v-card>
        <video
          :srcObject="stream"
          width="100%"
          height="100%"
          autoplay
          ref="videoCaller"
        />
      </v-card>
      <v-card>
        <video :srcObject="stream1" width="100%" height="100%" ref="videoReceiver" />
      </v-card>
    </div>
    <v-row class="ma-10">
      <v-btn id="start-call" @click="handleStartCall">Bắt đầu cuộc gọi</v-btn>
      <v-btn id="start-call" @click="handleStopCall">Kết thúc cuộc gọi</v-btn>
      <v-btn id="start-call">Bắt đầu cuộc gọi</v-btn>
      <v-btn id="start-call">Bắt đầu cuộc gọi</v-btn>
    </v-row>
  </v-container>
</template>
<script lang="ts" setup>
const stream = ref<MediaStream | null>(null);
const stream1 = ref<MediaStream | null>(null);
const constraints = {
  audio: false,
  video: {
    width: { min: 1024, ideal: 1280, max: 1920 },
    height: { min: 576, ideal: 720, max: 1080 },
    facingMode: "environment",
  },
};
const handleStartCall = async () => {
  const mediaSteam = await navigator.mediaDevices.getUserMedia(constraints);
  console.log(mediaSteam);
  stream.value = mediaSteam;
};

const handleStopCall = () => {
  stream.value?.getTracks().forEach((track) => track.stop());
};
</script>

<style lang="scss" scoped>
.video-container {
  height: 100vh;
}

.video-frame {
  width: 100vw;
  height: 300px;
  gap: 30px;
  display: flex;
}
</style>
