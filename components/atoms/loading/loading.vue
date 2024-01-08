<template>
  <div class="loading" v-if="isLoading">
    <v-progress-circular indeterminate color="green" :width="8" :size="100" />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  isLoading: Boolean,
});
</script>

<style lang="scss" scoped>
.loading {
  opacity: 0.5;
  background-color: rgb(0, 0, 0);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}
</style>
