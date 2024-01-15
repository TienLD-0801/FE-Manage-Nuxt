<template>
  <v-list-item
    :ripple="false"
    :class="['chat-item', activeItem && 'active-color'].join(' ')"
  >
    <div class="chat-frame">
      <v-avatar class="message-avatar" :image="avatar"></v-avatar>
      <div class="message-content">
        <div class="message-label">
          {{ name }}
          <span class="latest-time" v-text="time" />

          <v-menu transition="slide-y-transition">
            <template v-slot:activator="{ props }">
              <v-icon
                v-bind="props"
                class="options-icon"
                icon="mdi-dots-horizontal"
                size="18"
              />
            </template>
            <v-list class="chat-item-options">
              <v-list-item class="option-item" @click="console.log('delete chat item')">
                <v-list-item-title :style="{ color: 'red' }" class="option-label"
                  >Delete conservation</v-list-item-title
                >
              </v-list-item>
              <v-list-item class="option-item" @click="console.log('delete chat item')">
                <v-list-item-title class="option-label"
                  >Pin Conservation</v-list-item-title
                >
              </v-list-item>
              <v-list-item class="option-item" @click="console.log('delete chat item')">
                <v-list-item-title class="option-label"
                  >Hide conservation</v-list-item-title
                >
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <p class="message-text">
          <span class="message-target" v-text="subMessage" />
          <span v-text="lastMessage" />
        </p>
      </div>
    </div>
  </v-list-item>
</template>

<script lang="ts" setup>
defineProps<{
  name: string;
  avatar: string;
  subMessage: string;
  lastMessage: string;
  time: string;
  activeItem: boolean;
}>();
</script>

<style lang="scss" scoped>
.chat-item {
  padding: 0 10px;
  background-color: white !important;

  &:hover {
    .latest-time {
      display: none;
    }

    .options-icon {
      visibility: visible;
    }
  }
}

.chat-item-options {
  .v-list-item--density-default.v-list-item--one-line {
    min-height: 5px;

    .option-label {
      font-size: 0.9rem;
    }
  }
}

.chat-item .latest-time {
  position: absolute;
  right: 15px;
}

.chat-item .options-icon {
  visibility: hidden;
}

.chat-item .chat-frame {
  display: flex;
  gap: 15px;
  align-items: center;
}

.chat-frame .message-avatar {
  width: 40px;
  height: 40px;
}

.chat-frame .message-content {
  width: 100%;
  font-size: 0.9rem;
  border-bottom: 1px solid rgb(184, 183, 183);
  height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.message-content .message-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
}

.message-label span {
  font-size: 0.7rem;
  color: rgb(139, 140, 142);
}

.message-content .message-text {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  color: black;
}

.message-text .message-target {
  color: rgb(58, 112, 200);
}

.active-color {
  background-color: rgba(73, 128, 218, 0.1) !important;
}
</style>
