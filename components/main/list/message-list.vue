<template>
  <v-container class="message-container overflow-y-auto">
    <v-row
      v-for="item in messageList"
      :key="item.message_id"
      :class="item.user_id === $state.profile?.id ? 'message-right' : 'message-left'"
      class="message"
    >
      <v-chip
        variant="flat"
        :color="item.user_id === $state.profile?.id ? 'primary' : ''"
        size="large"
        >{{ item.content }}</v-chip
      >
    </v-row>
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
}

.message {
  justify-content: center;
  max-height: 40px;
  width: auto;
  display: flex;
  align-content: flex-end;
  padding: 0 20px;
  margin: 0;
}

.message-right {
  align-self: flex-end;
}

.message-left {
  align-self: flex-start;
}
</style>
