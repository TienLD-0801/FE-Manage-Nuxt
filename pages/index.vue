<template>
  <div>
    <v-btn @click="goToAdmin"> Login cá độ</v-btn>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
  </div>
</template>
<script lang="ts" setup>
const goToAdmin = async () => {
  await navigateTo("/admin-login");
};
</script>

<style></style>
