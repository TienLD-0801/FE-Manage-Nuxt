<template>
  <v-list-item :class="['message-box-container', isSelf && 'self-background'].join(' ')">
    {{ content }}
    <v-list-item-subtitle>
      {{ convertTimeMessage(time) }}
    </v-list-item-subtitle>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps<{
  content: string;
  time: string;
  isSelf: boolean;
}>();
import { convertTimeMessage } from "~/ultils/convert";
</script>

<style lang="scss" scoped>
.message-box-container {
  white-space: pre-line;
  width: fit-content;
  max-width: 400px;
  padding: 10px 18px;
  border-radius: 18px;
  word-wrap: break-word;
  background-color: rgb(224, 224, 224);
  color: black;
}

.self-background {
  background-color: rgb(36, 111, 198) !important;
  color: white;
  align-self: flex-end;
}
</style>
