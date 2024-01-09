<template>
  <v-main class="main-panel-container">
    <h2>Security</h2>
    <v-container class="security-container">
      <div class="security-box">
        <v-banner lines="one" icon="mdi-lock" color="deep-purple-accent-4" class="my-4">
          <v-banner-text> Change password </v-banner-text>
          <template v-slot:actions>
            <v-btn>Change</v-btn>
          </template>
        </v-banner>

        <v-banner lines="two" icon="mdi-weather-hurricane" color="error" class="my-4">
          <v-banner-text>
            We use cookies to improve HubSpot’s site. Some cookies are necessary for our
            website and services to function properly. Other cookies are optional and help
            personalize your experience, including advertising and analytics. You can
            consent to all cookies, decline all optional cookies, or manage optional
            cookies. Without a selection, our default cookie settings will apply. You can
            change your preferences at any time
          </v-banner-text>

          <template v-slot:actions>
            <v-btn>Contact</v-btn>
          </template>
        </v-banner>

        <v-banner lines="three" icon="$warning" color="warning" class="my-4">
          <v-banner-text>
            When visiting a website if this message pops up it is better not to go ahead.
            The message means that Google has identified that your website is hacked and
            uploads malicious. The malicious code will probably download and install
            itself on the visitor’s computer and infect it.
          </v-banner-text>
          <template v-slot:actions>
            <v-btn>Detail</v-btn>
          </template>
        </v-banner>

        <v-banner lines="one" icon="mdi-wifi-strength-alert-outline" color="warning">
          <template v-slot:text> No Internet connection </template>
          <template v-slot:actions>
            <v-btn> Retry </v-btn>
          </template>
        </v-banner>
      </div>
    </v-container>
  </v-main>
</template>

<script lang="ts" setup></script>

<style lang="scss">
.security-container {
  height: 100%;
  display: flex;
  justify-content: center;
}

.security-container .security-box {
  border: 1px solid rgb(232, 232, 232);
  border-radius: 10px;
}
</style>
