<template>
  <v-main class="default-panel-container main-panel-container">
    <div class="default-header">
      <p class="default-title">Welcome to <b>Chatty</b></p>
      <p class="default-subtitle">
        A chat application makes it easy to communicate with people anywhere in the world
        by sending and receiving messages in real time. Users are able to receive the same
        engaging and lively interactions through custom messaging features.
      </p>
    </div>
    <div class="default-body-view">
      <div class="default-view-1">
        <video autoplay loop muted playsinline width="100%" height="100%">
          <source src="/imgs/default-panel-1.mp4" type="video/mp4" />
        </video>
      </div>
      <div class="default-view-2">
        <video autoplay loop muted playsinline width="100%" height="100%">
          <source src="/imgs/default-panel-0.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
    <div class="default-footer">
      Get started chat with your friends to have great conservations.
    </div>
  </v-main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.default-panel-container {
  display: flex;
  justify-content: space-evenly;
}

.default-panel-container .default-header {
  display: flex;
  align-items: center;
  flex-direction: column;
  row-gap: 15px;
  text-align: center;
}

.default-title {
  font-size: 1.25rem;
}

.default-subtitle {
  font-size: 0.85rem;
  width: 520px;
}

.default-panel-container .default-body-view {
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
}

.default-panel-container .default-footer {
  display: flex;
  justify-content: center;
  color: rgb(71, 132, 190);
  font-weight: 500;
  height: 100px;
}

.default-panel-container .default-view-1 {
  width: 100%;
  height: 100%;
  background-size: cover;
}

.default-panel-container .default-view-2 {
  width: 100%;
  height: 100%;
  background-size: cover;
}
</style>
