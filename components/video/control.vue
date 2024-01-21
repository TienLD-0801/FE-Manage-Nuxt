<template>
  <v-container class="control" elevation="0">
    <v-btn
      :icon="!isCamera ? 'mdi-video-outline' : 'mdi-video-off-outline'"
      v-if="!isReceiver || isAnswer"
      @click="$emit('on-camera')"
    />
    <v-btn icon="mdi-volume-high" v-if="!isReceiver || isAnswer" />
    <v-btn icon="mdi-phone-hangup" color="red" @click="$emit('on-hangup')" />
    <div @click="$emit('on-voice')">
      <v-btn icon="mdi-microphone" v-if="!isReceiver || isAnswer" />
      <!-- <v-btn icon="mdi-microphone-off" v-else /> -->
      <v-btn
        icon="mdi-phone"
        color="green"
        @click="$emit('on-answer')"
        v-if="!isAnswer && isReceiver"
      />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  isVoice: boolean;
  isAnswer: boolean;
  isReceiver: boolean;
  isCamera: boolean;
}>();
defineEmits(["on-voice", "on-hangup", "on-answer", "on-camera"]);
</script>

<style lang="scss" scoped>
.control {
  width: auto;
  display: flex;
  bottom: 10%;
  left: 0;
  right: 0;
  position: fixed;
  z-index: 2;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  gap: 30px;
}
</style>
