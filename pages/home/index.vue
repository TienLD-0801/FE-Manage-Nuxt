<template>
  <v-card>
    <v-layout>
      <NavigatorDrawer />
      <BodyTab />
    </v-layout>
  </v-card>
</template>
<script lang="ts" setup>
definePageMeta({
  middleware: "home-guard",
});
const { $auth } = useNuxtApp();
// setTimeout(() => {
//   console.log(" $auth.currentUser;", $auth.currentUser);
// }, 2000);
</script>

<style lang="scss" scoped></style>
