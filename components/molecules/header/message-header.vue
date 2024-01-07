<template>
  <v-card color="grey-lighten-4" flat height="200px" rounded="0">
    <v-toolbar class="message-header-container" density="compact">
      <v-list-item
        prepend-avatar="https://zpsocial-f51-org.zadn.vn/ec3f0d5e57deb980e0cf.jpg"
        title="Le Duy Tien"
        nav
      />
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card>
</template>

<style lang="scss" scoped>
.message-header-container {
  width: 100%;
  background-color: white;
  border-bottom: 1px solid rgb(208, 208, 208);
}
</style>
