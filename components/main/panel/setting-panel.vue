<template>
  <v-main class="main-panel-container">
    <NuxtLoadingIndicator :height="3" />
    <h2>Profile</h2>
    <v-container class="setting-container">
      <v-list>
        <v-list-item>
          <div class="setting-profile">
            <v-skeleton-loader :loading="isSkeleton" class="mx-auto" type="avatar">
              <v-avatar :image="model.avatar" class="avatar" :size="140" />
            </v-skeleton-loader>
            <v-file-input
              v-model="files"
              accept="image/*"
              style="display: none"
              :id="inputElementId"
              @change="handleChangeAvatar"
            />
            <v-btn @click="onOpenFile()" text="Upload" v-if="typeEdit" />
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
      <v-btn
        class="button-save"
        type="submit"
        variant="elevated"
        color="blue"
        :disabled="isCheckDuplicateField || isSkeleton"
        :text="typeEdit ? 'Save' : 'Edit'"
      />
    </v-form>
  </v-main>
</template>

<script lang="ts" setup>
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { FIRESTORE_PATH } from "~/shared/constant/firebase-store";
const { $state, updateProfile } = useProfileStore();
const { inputElementId, onOpenFile } = useElement();
const { uploadCloudinary } = useCloudinary();
const { updateChatInfo } = useFirebaseAuth();
const { $firestore } = useNuxtApp();
const { start, finish } = useLoadingIndicator();
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

const handleSaveProfile = async () => {
  typeEdit.value = !typeEdit.value;
  if (typeEdit.value) return;
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
    updateProfileChat();
    console.log("up date profile successfully");
  } catch (error) {
    console.log("Update profile Error :", error);
  } finally {
    setTimeout(() => {
      finish();
    }, 2000);
  }
};

const updateProfileChat = async () => {
  const groupChatQuery = await getDocs(
    collection($firestore, FIRESTORE_PATH.chat_collection)
  );
  groupChatQuery.forEach(async (docQuery) => {
    if (docQuery.id.split("-").includes($state.profile.id)) {
      await updateChatInfo(
        docQuery.get("sender").id,
        docQuery.get("receiver").id,
        $state.profile
      );
    }
  });
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
  height: 100%;
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
</style>
