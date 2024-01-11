<template>
  <v-list-item color="primary" class="chat-item">
    <div class="chat-frame">
      <v-avatar class="message-avatar" :image="avatar"></v-avatar>
      <div class="message-content">
        <div class="message-label">
          {{ name }}
          <span v-text="time" />
        </div>
        <p class="message-text">
          <span class="message-target" v-text="'You — '" />
          <span v-text="lastMessage" />
        </p>
      </div>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
}>();
</script>

<style lang="scss" scoped>
.chat-item {
  padding: 0 10px;
}

.chat-item .chat-frame {
  display: flex;
  gap: 15px;
  align-items: center;
}

.chat-frame .message-avatar {
  width: 40px;
  height: 40px;
}

.chat-frame .message-content {
  width: 100%;
  font-size: 0.9rem;
  border-bottom: 1px solid rgb(184, 183, 183);
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-content .message-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.message-label span {
  font-size: 0.7rem;
  color: rgb(139, 140, 142);
}

.message-content .message-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: black;
}

.message-text .message-target {
  color: rgb(58, 112, 200);
}
</style>
