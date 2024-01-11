<template>
  <v-snackbar v-model:model-value="snackbar" location="top" timeout="2000" color="red">
    <div class="title">{{ message }}</div>
    <template v-slot:actions>
      <v-btn class="text-button" color="white" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
const snackbar = defineModel({ type: Boolean, default: false });
defineProps<{
  message: string;
}>();
</script>

<style lang="scss" scoped>
.title {
  font-size: 16px;
  font-weight: 600;
}
.text-button {
  font-size: 25px;
  font-weight: 800;
}
</style>
