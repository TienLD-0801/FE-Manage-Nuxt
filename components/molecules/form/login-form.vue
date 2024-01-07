<template>
  <div class="login-form-container">
    <v-card class="auth-form mx-auto" max-width="344" title="User Login">
      <v-container>
        <v-text-field
          require
          :rules="[() => !!email || 'This field is required']"
          v-model="email"
          color="primary"
          label="Email"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          require
          :rules="[() => !!password || 'This field is required']"
          type="password"
          v-model="password"
          color="primary"
          label="Password"
          placeholder="Enter your password"
          variant="underlined"
        ></v-text-field>
      </v-container>

      <v-container class="register-frame">
        <a href="#" @click="navigateTo('/register')">Not have account? Register now</a>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="navigateTo('/home')" color="success">
          Ready login

          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    first: null,
    last: null,
    email: null,
    password: null,
    terms: false,
  }),
};
</script>

<style lang="scss" scoped>
.login-form-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
}

.login-form-container .register-frame {
  display: flex;
  flex-direction: row-reverse;
  font-size: 0.9rem;
  margin-top: -20px;
}

.register-frame a {
  text-decoration: none;
  color: rgb(48, 98, 169);
}
</style>
