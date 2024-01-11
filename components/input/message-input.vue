<template>
  <v-form class="message-input-container" @submit.prevent="$emit('on-send-message')">
    <v-col class="input-frame">
      <v-text-field
        v-model="message"
        append-icon="mdi-send"
        variant="filled"
        clear-icon="mdi-close-circle"
        clearable
        label="Message"
        type="text"
        @click:clear="$emit('on-clear-message')"
        @click:append="$emit('on-send-message')"
      ></v-text-field>
    </v-col>
  </v-form>
</template>
<script lang="ts" setup>
const message = defineModel({
  type: String,
  default: "",
});
</script>

<style lang="scss" scoped>
.message-input-container {
  width: 100%;
  border-top: 0.5px solid rgb(191, 191, 191);
}

.message-input-container .input-frame {
  padding-bottom: unset;
}
</style>
