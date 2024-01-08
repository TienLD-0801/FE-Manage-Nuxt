<template>
  <v-main class="main-panel-container">
    <h2>Settings</h2>
    <v-container class="setting-container">
      <v-list>
        <v-list-item>
          <div class="setting-profile">
            <v-avatar
              class="avatar"
              :image="'https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/333583624_765184891701108_7257567751896438417_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=efb6e6&_nc_ohc=N-Qct0pzlBAAX_mW0Gf&_nc_ht=scontent.fsgn5-8.fna&oh=00_AfA5gEx_pAlbZBMDFEDPHjrJ8Go-83JPe_ZuI2D-bepX-g&oe=65A13B36'"
            />
            <v-list-item-title>Dang Duy Bang</v-list-item-title>
            <v-list-item-subtitle>chatbot@gmail.com</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-container>

    <form class="form-profile" @submit.prevent="submit">
      <v-text-field
        v-model="fistName.value.value"
        :counter="10"
        :error-messages="fistName.errorMessage.value"
        :model-value="'Dang Duy'"
        label="First Name"
      ></v-text-field>

      <v-text-field
        v-model="lastName.value.value"
        :counter="7"
        :error-messages="lastName.errorMessage.value"
        :model-value="'Bang'"
        label="Last Name"
      ></v-text-field>

      <v-text-field
        v-model="email.value.value"
        :error-messages="email.errorMessage.value"
        label="E-mail"
        :model-value="'chatbot@gmail.com'"
        disabled
      ></v-text-field>

      <v-btn class="me-4" type="submit"> submit </v-btn>

      <v-btn @click="handleReset"> clear </v-btn>
    </form>
  </v-main>
</template>

<script setup>
import { useField, useForm } from "vee-validate";

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    firstName(value) {
      if (value?.length >= 2) return true;

      return "Name needs to be at least 2 characters.";
    },
    lastName(value) {
      if (value?.length > 9 && /[0-9-]+/.test(value)) return true;

      return "Phone number needs to be at least 9 digits.";
    },
    email(value) {
      if (/^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true;

      return "Must be a valid e-mail.";
    },
  },
});
const fistName = useField("name");
const lastName = useField("phone");
const email = useField("email");

const submit = handleSubmit((values) => {
  alert(JSON.stringify(values, null, 2));
});
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
