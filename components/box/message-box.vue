<template>
  <v-list-item :class="['message-box-container', isSelf && 'self-background'].join(' ')">
    <div :class="isSelf ? 'message-frame-self' : 'message-frame'">
      <v-avatar
        v-if="!isSelf"
        :class="!notShowAvatarAndName ? 'message-avatar' : 'no-message-avatar'"
        :image="profile.avatar"
      />
      <div class="message-content-frame">
        <v-list-subheader
          v-if="!isSelf && !notShowAvatarAndName"
          class="message-name-sender"
          >{{ `${profile.firstName} ${profile.lastName}` }}</v-list-subheader
        >
        <div :class="isSelf ? 'message-view-self' : 'message-view'">
          {{ content }}
          <v-list-item-subtitle v-if="!notShowTime">
            {{ convertTimeMessage(time) }}
          </v-list-item-subtitle>
        </div>
      </div>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps<{
  content: string;
  time: string;
  isSelf: boolean;
  notShowAvatarAndName?: boolean;
  notShowTime?: boolean;
  profile: TProfile;
}>();
</script>

<style lang="scss" scoped>
.message-box-container {
  width: fit-content;
  max-width: 430px;
}

.self-background {
  align-self: flex-end;
}

.message-frame {
  display: flex;
}

.message-frame-self {
  display: flex;
  flex-direction: row-reverse;
}

.message-view {
  background-color: rgb(224, 224, 224);
  color: black;
  padding: 10px 18px;
  border-radius: 18px;
  word-wrap: break-word;
  white-space: pre-line;
}

.message-view-self {
  background-color: rgb(36, 111, 198) !important;
  color: white;
  padding: 10px 18px;
  border-radius: 14px;
  word-wrap: break-word;
}

.message-avatar {
  margin-top: 40px;
  margin-right: 5px;
}

.no-message-avatar {
  visibility: hidden;
  margin-left: 6px;
}

.message-name-sender {
  margin-left: 10px;
  margin-bottom: -6px;
}
</style>
