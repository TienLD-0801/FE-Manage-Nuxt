<template>
  <div class="login-form-container">
    <v-card class="auth-form mx-auto rounded-lg" max-width="380" title="User Login">
      <v-container>
        <v-container>
          <v-form>
            <v-text-field
              v-model="data.email"
              require
              :rules="[() => !!data.email || 'This field is required']"
              color="primary"
              label="Email"
              variant="underlined"
            ></v-text-field>
            <v-text-field
              v-model="data.password"
              require
              :rules="[() => !!data.password || 'This field is required']"
              type="password"
              autocomplete="on"
              color="primary"
              label="Password"
              placeholder="Enter your password"
              variant="underlined"
            ></v-text-field>
          </v-form>
        </v-container>
      </v-container>
      <v-container class="register-frame">
        <a href="#" @click="navigateTo('/register')">Not have account? Register now</a>
      </v-container>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          :disabled="data.email && data.password ? false : true"
          @click="$emit('handleLogin', data)"
          color="success"
        >
          Ready login
          <v-icon icon="mdi-chevron-right" end></v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
const data = ref({
  email: "",
  password: "",
});
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
