<template>
  <div class="register-page-container">
    <RegisterForm @handleRegister="handleRegister" />
  </div>
</template>
<script lang="ts" setup>
const { register } = useFirebaseAuth();

const handleRegister = async (data: any) => {
  try {
    const status = await register(data.email, data.password);
    console.log(status);
  } catch (error) {
    console.log(error);
  }
};
</script>
<style lang="scss" scoped>
.register-page-container {
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
