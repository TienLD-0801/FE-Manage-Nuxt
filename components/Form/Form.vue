<template>
  <v-sheet width="300" class="mx-auto">
    <v-form fast-fail @submit.prevent>
      <v-text-field label="Username" />
      <v-text-field label="Password" />
      <v-btn type="submit" block class="mt -2" @click="handleClick">Login</v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
const handleClick = () => {
  console.log("abc");
};
</script>

<style></style>
