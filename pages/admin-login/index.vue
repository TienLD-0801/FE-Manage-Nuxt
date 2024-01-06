<template>
    <v-sheet width="300" class="mx-auto">
      <v-form fast-fail @submit.prevent>
        <v-text-field
        
          label="First name"
          
        ></v-text-field>
  
        <v-text-field
          
          label="Last name"
          
        ></v-text-field>
  
        <v-btn type="submit" block class="mt-2">Submit</v-btn>
      </v-form>
    </v-sheet>
  </template>