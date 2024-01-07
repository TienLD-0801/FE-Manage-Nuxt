<template>
  <div class="login-page-container">
    <LoginForm @handleLogin="handleLogin" />
  </div>
</template>
<script lang="ts" setup>
const { login } = useFirebaseAuth();
const userStore = useUserStore();

const handleLogin = async (user: { email: string; password: string }) => {
  try {
    await login(user.email, user.password);
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.login-page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("/imgs/bg-intro.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>
