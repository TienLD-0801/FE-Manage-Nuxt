<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="message"
            :append-icon="'mdi-send'"
            :prepend-icon="icon"
            variant="filled"
            clear-icon="mdi-close-circle"
            clearable
            label="Write a message"
            type="text"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>
