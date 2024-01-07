<template>
  <div class="register-form-container">
    <v-card class="auth-form mx-auto" max-width="344" title="User Registration">
      <v-container>
        <v-text-field
          require
          :rules="[() => !!first || 'This field is required']"
          v-model="first"
          color="primary"
          label="First name"
          variant="underlined"
        ></v-text-field>

        <v-text-field
          require
          :rules="[() => !!last || 'This field is required']"
          v-model="last"
          color="primary"
          label="Last name"
          variant="underlined"
        ></v-text-field>

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

        <v-checkbox
          v-model="terms"
          color="secondary"
          label="I agree to site terms and conditions"
        ></v-checkbox>
      </v-container>

      <v-container class="login-frame">
        <a href="#" @click="navigateTo('/login')">Available account? Login now</a>
      </v-container>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn @click="navigateTo('/login')" color="success">
          Complete Registration

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
