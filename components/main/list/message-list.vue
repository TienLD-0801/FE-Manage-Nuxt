<template>
  <v-container id="message-container" class="message-container">
    <div
      v-for="item in messageList"
      :key="item.message_id"
      :class="item.user_id === $state.profile?.id ? 'message-right' : 'message-left'"
      class="message"
    >
      <div>
        <v-chip size="large">{{ item.content }}</v-chip>
      </div>
    </div>
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
  padding: 15px 25px;
  max-width: none;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  justify-content: flex-end;
}

.message {
  margin-bottom: 12px;
}

.message-right {
  align-self: flex-end; /* Tin nhắn từ người gửi sẽ căn lề phải */
  /* Thêm kiểu dáng cho tin nhắn bên phải */
}

.message-left {
  align-self: flex-start; /* Tin nhắn từ người nhận sẽ căn lề trái */
  /* Thêm kiểu dáng cho tin nhắn bên trái */
}
</style>
