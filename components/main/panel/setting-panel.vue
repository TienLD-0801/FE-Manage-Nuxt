<template>
  <v-main class="main-panel-container">
    <NuxtLoadingIndicator :height="3" />
    <h2>Profile</h2>
    <v-container class="setting-container">
      <v-list>
        <v-list-item>
          <div class="setting-profile">
            <v-skeleton-loader :loading="isSkeleton" class="mx-auto" type="avatar">
              <v-avatar
                :style="typeEdit && { opacity: 0.3 }"
                :image="model.avatar"
                class="avatar"
                :size="100"
              />
            </v-skeleton-loader>
            <v-file-input
              v-model="files"
              accept="image/*"
              style="display: none"
              :id="inputElementId"
              @change="handleChangeAvatar"
            />
            <v-btn v-if="typeEdit" @click="onOpenFile()" class="upload-btn">
              <v-icon size="30" icon="mdi-camera-plus-outline"></v-icon>
            </v-btn>
          </div>
          <div class="setting-info">
            <v-list-item-title class="title">{{ infoUser.name }}</v-list-item-title>
            <v-label>{{ infoUser.email }}</v-label>
          </div>
        </v-list-item>
      </v-list>
    </v-container>

    <v-form class="form-profile" @submit.prevent="handleSaveProfile">
      <v-text-field
        :disabled="!typeEdit"
        v-model="model.firstName"
        label="First Name"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        :disabled="!typeEdit"
        v-model="model.lastName"
        label="Last Name"
        variant="outlined"
      ></v-text-field>
      <v-text-field
        disabled
        v-model="model.email"
        label="Email"
        variant="outlined"
      ></v-text-field>
      <div :style="{ display: 'flex', flexDirection: 'row-reverse', gap: '10px' }">
        <v-btn
          class="button-save"
          type="submit"
          variant="elevated"
          color="blue"
          :disabled="isCheckDuplicateField || isSkeleton"
          :text="typeEdit ? 'Save' : 'Edit'"
        />
        <v-btn
          class="button-save"
          variant="elevated"
          color="grey"
          text="Cancel"
          v-if="typeEdit"
          @click="cancelEdit"
        />
      </div>
    </v-form>
  </v-main>
</template>

<script lang="ts" setup>
import { doc, updateDoc } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $state, updateProfile } = useProfileStore();
const { uploadCloudinary } = useCloudinary();
const { $firestore } = useNuxtApp();
const { start, finish } = useLoadingIndicator();
const { inputElementId, onOpenFile } = useElement();
const typeEdit = ref(false);
const files = ref<File[]>([]);
const isSkeleton = ref<boolean>(false);

const model = ref<TProfile>({
  id: $state.profile.id,
  firstName: $state.profile.firstName,
  lastName: $state.profile.lastName!,
  email: $state.profile.email,
  updated_at: new Date().toString(),
  created_at: $state.profile.created_at,
  avatar: $state.profile.avatar,
});

const infoUser = ref({
  name: `${$state.profile.firstName} ${$state.profile.lastName}`,
  avatar: $state.profile.avatar,
  email: $state.profile.email,
});

const isCheckDuplicateField = computed(() => {
  const currentName = infoUser.value.name;
  const newName = `${model.value.firstName} ${model.value.lastName}`;
  return (
    currentName.replace(/\s+/g, "").trim() === newName.replace(/\s+/g, "").trim() &&
    typeEdit.value &&
    infoUser.value.avatar === model.value.avatar
  );
});

const cancelEdit = () => {
  typeEdit.value = false;
  model.value.firstName = $state.profile.firstName;
  model.value.lastName = $state.profile.lastName;
  model.value.avatar = $state.profile.avatar;
};

const handleSaveProfile = async () => {
  typeEdit.value = !typeEdit.value;
  if (typeEdit.value === true) {
    return;
  }
  start();
  try {
    infoUser.value = {
      name: `${model.value.firstName} ${model.value.lastName}`,
      avatar: model.value.avatar,
      email: model.value.email,
    };

    await updateDoc(
      doc($firestore, FIRESTORE_PATH.user_collection, $state.profile.id),
      model.value
    );
    updateProfile(model.value);
    console.log("Update profile successfully");
  } catch (error) {
    console.log("Error update profile: ", error);
  } finally {
    setTimeout(() => {
      finish();
    }, 2000);
  }
};

const handleChangeAvatar = async () => {
  if (!files) return;
  isSkeleton.value = true;
  try {
    const secure_url = await uploadCloudinary(files.value[0]);
    if (secure_url) {
      model.value.avatar = secure_url;
    }
  } catch (error) {
    console.log(error);
  } finally {
    isSkeleton.value = false;
  }
};
</script>

<style lang="scss" scoped>
.form-profile {
  margin: 0px 200px 500px 200px;
}
.setting-container {
  display: flex;
  justify-content: center;
}

.setting-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.setting-container .setting-profile {
  gap: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.setting-container .avatar {
  width: 100%;
  height: 100%;
}
.button-save {
  float: right;
  margin: 0;
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: blueviolet;
}

.upload-btn {
  background-color: rgba(1, 1, 1, 0.1);
  width: 100px;
  height: 100px;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
}
</style>
