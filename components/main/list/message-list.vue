import { MessageBox } from '../../../.nuxt/components.d';
<template>
  <v-container class="message-container overflow-y-auto">
    <MessageBox
      v-for="item in messageList"
      :key="item.message_id"
      :content="item.content"
      :time="item.created_at"
      :isSelf="item.user_id === $state.profile?.id"
    />
  </v-container>
</template>

<script setup lang="ts">
defineProps<{
  messageList: TMessage[];
}>();
const { $state } = useProfileStore();
</script>

<style lang="scss" scoped>
.message-container {
  height: 100%;
  max-width: none;
  display: flex;
  flex-direction: column-reverse;
  gap: 20px;
  padding: 15px 25px;
}
</style>
