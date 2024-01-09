<template>
  <v-main class="main-panel-container">
    <h2>Settings</h2>
    <v-container class="setting-container">
      <v-list>
        <v-list-item>
          <div class="setting-profile">
            <v-avatar class="avatar" :image="$state.profile?.avatar" />
            <v-list-item-title
              v-text="`${$state.profile?.firstName} ${$state.profile?.lastName}`"
            />
            <v-list-item-subtitle>{{ $state.profile?.email }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-container>

    <form class="form-profile">
      <v-text-field
        v-model="fistName.value.value"
        :counter="10"
        :error-messages="fistName.errorMessage.value"
        label="First Name"
      ></v-text-field>

      <v-text-field
        v-model="lastName.value.value"
        :counter="7"
        :error-messages="lastName.errorMessage.value"
        label="User"
      ></v-text-field>

      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        label="E-mail"
      ></v-text-field>

      <v-btn class="me-4" type="submit"> submit </v-btn>

      <v-btn> clear </v-btn>
    </form>
  </v-main>
</template>

<script lang="ts" setup>
import { useField, useForm } from "vee-validate";
const { $state } = useProfileStore();

const fistName = useField("name");
const lastName = useField("phone");
const email = useField("email");
</script>

<style lang="scss" scoped>
.form-profile {
  margin: 0px 200px 500px 200px;
}
.setting-container {
  height: 100%;
  display: flex;
  justify-content: center;
}

.setting-container .setting-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.setting-container .avatar {
  width: 100px;
  height: 100px;
}
</style>
