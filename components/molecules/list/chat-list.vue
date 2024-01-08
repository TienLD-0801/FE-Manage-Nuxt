<template>
  <v-card class="mx-auto" max-width="450">
    <v-list item-props lines="three">
      <v-list-item
        v-for="(item, i) in items"
        :key="i"
        :value="item"
        color="primary"
        @click="navigatorTab.changeNavigatorTab('chat')"
      >
        <v-container class="container-list">
          <v-avatar :image="item.prependAvatar"></v-avatar>
          <div v-html="item.subtitle"></div>
        </v-container>
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
    subtitle: `<span class="text-primary">You</span> &mdash; Cũng hơi lạ là, nó có trả ra acesssToken nhưng anh chấm tới thì ko nhắc`,
  },
  {
    id: "2",
    prependAvatar:
      "https://png.pngtree.com/background/20230613/original/pngtree-three-cheetahs-are-looking-at-the-camera-picture-image_3426473.jpg",
    title: "Vo Tri",
    subtitle: `<span class="text-primary">to Tien</span> &mdash; Nằm bên hông coopmart á`,
  },
  {
    id: "3",
    prependAvatar: "https://appdata.chatwork.com/avatar/RMb5BZxB70.gif",
    title: "Duong Van Khuong",
    subtitle: "Anh có biết gì đâu",
  },
  {
    id: "4",
    prependAvatar: "https://zpsocial-f52-org.zadn.vn/00c9a7968c3a62643b2b.jpg",
    title: "Nguyen Tran Phuong Tram",
    subtitle: "App nó chỉnh chưa đều thông cảm, sức app có giới hạn",
  },
  {
    id: "5",
    prependAvatar: "https://appdata.chatwork.com/avatar/R76ZQoNB7r.rsz.jpg",
    title: "Tran Chi Huu",
    subtitle:
      '<span class="text-primary">You</span> &mdash; Làm sao để mình lấy được accessToken trong store',
  },
];
</script>

<style lang="scss" scoped>
.container-list {
  padding: 0;
  display: flex;
  justify-content: flex-start;
  gap: 20px;
}
</style>
