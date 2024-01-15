<template>
  <v-checkbox :disabled="disabled" class="user-selection-item" :value="value">
    <template v-slot:label>
      <div>
        <v-tooltip location="bottom">
          <template v-slot:activator>
            <v-avatar
              class="avatar"
              image="https://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png"
            />
          </template>
        </v-tooltip>
        {{ label }}
      </div>
    </template>
  </v-checkbox>
</template>

<script lang="ts" setup>
defineProps<{
  value: TProfile;
  label: string;
  disabled?: boolean;
}>();
</script>

<style lang="scss" scoped>
.user-selection-item {
  height: 50px;
}
</style>
