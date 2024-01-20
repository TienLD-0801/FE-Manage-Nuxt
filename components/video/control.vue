<template>
  <v-container class="control" elevation="0">
    <v-btn icon="mdi-volume-high" />
    <v-btn icon="mdi-phone-hangup" @click="$emit('on-hangup')" />
    <div @click="$emit('on-voice')">
      <v-btn icon="mdi-microphone" v-if="!isVoice" :disabled="!isCalling" />
      <v-btn icon="mdi-microphone-off" v-else />
    </div>
  </v-container>
</template>

<script lang="ts" setup>
defineProps<{
  isVoice: boolean;
  isCalling: boolean;
}>();
defineEmits(["on-voice", "on-hangup"]);
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
