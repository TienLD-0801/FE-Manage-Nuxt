<template>
  <v-infinite-scroll id="message-list-scroll" class="message-scroll" side="end">
    <MessageBox
      v-for="item in messageList"
      :key="item.message_id"
      :content="item.content"
      :time="item.created_at"
      :isSelf="item.user_id === $state.profile?.id"
    />
    <template v-slot:loading> CustomLoading</template>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
defineProps<{
  messageList: TMessage[];
}>();
const { $state } = useProfileStore();
</script>

<style lang="scss" scoped>
.message-scroll {
  flex-direction: column-reverse;
  height: 100vh;
  gap: 20px;
  padding: 0 25px;
}
</style>
