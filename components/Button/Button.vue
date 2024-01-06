<template>
  <v-sheet width="300" class="mx-auto">
    <v-form fast-fail @submit.prevent>
      <v-text-field label="First name" />
      <v-text-field label="Last name" />
      <v-btn type="submit" block class="mt -2" @click="handleClick"> Submit </v-btn>
    </v-form>
  </v-sheet>
</template>

<script lang="ts" setup>
const handleClick = () => {
  console.log("abc");
};
</script>

<style></style>
