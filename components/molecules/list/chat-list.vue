<template>
  <v-card class="chat-list-container mx-auto" max-width="450">
    <v-list class="chat-list" item-props lines="three">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        class="chat-item"
        color="primary"
        @click="navigatorTab.changeNavigatorTab('chat')"
      >
        <div class="chat-frame">
          <v-avatar class="message-avatar" :image="item.prependAvatar"></v-avatar>
          <div class="message-content">
            <div class="message-label">
              <h5 v-text="item.title" />
              <span v-text="item.time" />
            </div>
            <p class="message-text">
              <span class="message-target" v-text="item.last" />
              <span v-text="item.content" />
            </p>
          </div>
        </div>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script lang="ts" setup>
const navigatorTab = useNavigatorTabStore();

const items = [
  {
    id: "1",
    prependAvatar: "https://zpsocial-f51-org.zadn.vn/ec3f0d5e57deb980e0cf.jpg",
    title: "Le Duy Tien",
    last: "You — ",
    time: "08:26 am",
    content: `Cũng hơi lạ là, nó có trả ra acesssToken nhưng anh chấm tới thì ko nhắc`,
  },
  {
    id: "2",
    prependAvatar:
      "https://png.pngtree.com/background/20230613/original/pngtree-three-cheetahs-are-looking-at-the-camera-picture-image_3426473.jpg",
    title: "Vo Tri",
    last: "to Tien — ",
    time: "08:30 am",
    content: `Nằm bên hông coopmart á`,
  },
  {
    id: "3",
    prependAvatar: "https://appdata.chatwork.com/avatar/RMb5BZxB70.gif",
    title: "Duong Van Khuong",
    last: "",
    time: "09:58 am",
    content: "Anh có biết gì đâu",
  },
  {
    id: "4",
    prependAvatar: "https://zpsocial-f52-org.zadn.vn/00c9a7968c3a62643b2b.jpg",
    title: "Nguyen Tran Phuong Tram",
    last: "",
    time: "14:10 am",
    content: "App nó chỉnh chưa đều thông cảm, sức app có giới hạn",
  },
  {
    id: "5",
    prependAvatar: "https://appdata.chatwork.com/avatar/R76ZQoNB7r.rsz.jpg",
    title: "Tran Chi Huu",
    last: "You — ",
    time: "17:39 am",
    content: "Làm sao để mình lấy được accessToken trong store",
  },
];
</script>

<style lang="scss" scoped>
.chat-list-container .chat-list {
  padding-top: 0 !important;
}
.chat-list-container .chat-item {
  padding: 0 10px;
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
}

.message-text .message-target {
  color: rgb(58, 112, 200);
}
</style>
