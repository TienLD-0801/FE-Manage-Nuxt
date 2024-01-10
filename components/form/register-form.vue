<template>
  <div class="register-form-container">
    <v-card class="auth-form mx-auto" max-width="344" title="User Registration">
      <v-container>
        <v-form>
          <v-text-field
            v-model="data.firstName"
            require
            color="primary"
            label="First name"
            variant="underlined"
          ></v-text-field>
          <v-text-field
            v-model="data.lastName"
            require
            color="primary"
            label="Last name"
            variant="underlined"
          ></v-text-field>
          <v-text-field
            v-model="data.email"
            require
            color="primary"
            label="Email"
            variant="underlined"
          ></v-text-field>
          <v-text-field
            v-model="data.password"
            require
            autocomplete="on"
            type="password"
            color="primary"
            label="Password"
            placeholder="Enter your password"
            variant="underlined"
          ></v-text-field>
          <v-checkbox
            color="secondary"
            label="I agree to site terms and conditions"
          ></v-checkbox>
        </v-form>
      </v-container>

      <v-container class="login-frame">
        <a href="#" @click.prevent="navigateTo(PATH_ROUTER.login)"
          >Available account? Login now</a
        >
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="$emit('handleRegister', data)" color="success">
          Complete Registration
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { PATH_ROUTER } from "~/shared/constant/router";

const data = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
});
</script>

<style lang="scss" scoped>
.register-form-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
}

.register-form-container .login-frame {
  display: flex;
  flex-direction: row-reverse;
  font-size: 0.9rem;
  margin-top: -40px;
}

.login-frame a {
  text-decoration: none;
  color: rgb(48, 98, 169);
}
</style>
