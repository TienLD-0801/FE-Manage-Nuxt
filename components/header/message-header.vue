<template>
  <v-card color="grey-lighten-4" flat height="200px" rounded="0">
    <v-toolbar class="message-header-container" density="compact">
      <v-list-item :prepend-avatar="avatar" :title="name" nav />
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<script lang="ts" setup>
defineProps({
  name: String,
  avatar: String,
});
</script>

<style lang="scss" scoped>
.message-header-container {
  width: 100%;
  height: 64px;
  background-color: white;
  border-bottom: 1px solid rgb(208, 208, 208);
}
</style>
