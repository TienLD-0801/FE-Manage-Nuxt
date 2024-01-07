<template>
  <div class="container">
    <div>Counter: {{ counter.number }}</div>
    <button class="cong" @click="increment">+</button>
    <button class="tru" @click="decrement">-</button>
  </div>
</template>
<script lang="ts" setup>
const counter = useCounterStore();
const increment = () => {
  counter.increment();
};
const decrement = () => {
  counter.decrement();
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.cong {
  background: red;
}
.tru {
  background: blue;
}
</style>
