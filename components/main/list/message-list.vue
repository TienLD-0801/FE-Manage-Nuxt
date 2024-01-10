<template>
  <v-container class="message-container">
    <div
      v-for="(message, index) in data"
      :key="index"
      :class="message.from === 'nguoiA' ? 'message-right' : 'message-left'"
      class="message"
    >
      <div>
        <v-chip size="large">{{ message.content }}</v-chip>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
const data = ref([
  { from: "nguoiA", content: "Xin chào bạn" },
  { from: "nguoiA", content: "Toi la tien" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
  { to: "nguoiA", content: "chao ban nhe" },
]);
</script>

<style lang="scss" scoped>
.message-container {
  overflow: auto;
  height: 100%;
  padding: 0 16px;
  max-width: none;
  display: flex;
  flex-direction: column-reverse;
}

.message {
  margin-bottom: 10px;
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
