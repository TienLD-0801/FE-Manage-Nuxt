<template>
  <v-main class="default-panel-container main-panel-container">
    <div class="default-view-1" />
    <div class="default-view-2" />
  </v-main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.default-panel-container {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}
.default-panel-container .default-view-1 {
  width: 400px;
  height: 500px;
  background-image: url("/imgs/default-panel-0.gif");
  background-size: contain;
}

.default-panel-container .default-view-2 {
  width: 400px;
  height: 500px;
  background-image: url("/imgs/default-panel-1.gif");
  background-size: contain;
}
</style>
