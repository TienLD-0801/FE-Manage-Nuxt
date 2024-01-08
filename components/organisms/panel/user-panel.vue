<template>
  <v-main class="main-panel-container">
    <h2>Users</h2>
    <v-container class="user-container">
      <div class="user-box">
        <v-row align="center" justify="center">
          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Icons"
              subtitle="prepend and append"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account" color="primary"></v-icon>
              </template>
              <template v-slot:append>
                <v-icon icon="mdi-check" color="success"></v-icon>
              </template>
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Icons"
              subtitle="prepend-icon and append-icon"
              prepend-icon="mdi-account"
              append-icon="mdi-check"
            >
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Icons"
              subtitle="prepend and append"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account" color="primary"></v-icon>
              </template>
              <template v-slot:append>
                <v-icon icon="mdi-check" color="success"></v-icon>
              </template>
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Icons"
              subtitle="prepend-icon and append-icon"
              prepend-icon="mdi-account"
              append-icon="mdi-check"
            >
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Icons"
              subtitle="prepend and append"
            >
              <template v-slot:prepend>
                <v-icon icon="mdi-account" color="primary"></v-icon>
              </template>
              <template v-slot:append>
                <v-icon icon="mdi-check" color="success"></v-icon>
              </template>
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Avatars"
              subtitle="prepend-avatar and append-avatar"
              prepend-avatar="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"
              append-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
            >
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Avatars"
              subtitle="prepend and append"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-icon icon="mdi-alarm"></v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-avatar size="24">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.png"
                    alt="John"
                  ></v-img>
                </v-avatar>
              </template>
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Avatars"
              subtitle="prepend-avatar and append-avatar"
              prepend-avatar="https://cdn.vuetifyjs.com/images/logos/v-alt.svg"
              append-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
            >
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>

          <v-col cols="auto">
            <v-card
              class="mx-auto"
              max-width="300"
              title="Avatars"
              subtitle="prepend and append"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-darken-2">
                  <v-icon icon="mdi-alarm"></v-icon>
                </v-avatar>
              </template>
              <template v-slot:append>
                <v-avatar size="24">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.png"
                    alt="John"
                  ></v-img>
                </v-avatar>
              </template>
              <v-card-text
                >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.</v-card-text
              >
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.user-container {
  height: 100%;
  display: flex;
  justify-content: center;
}

.user-container .user-box {
}
</style>
