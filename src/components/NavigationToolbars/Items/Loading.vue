<template>
  <v-btn
    v-if="isLoading"
    text
    small
    icon
  >
    <v-progress-circular
      size="16"
      width="2"
      indeterminate
    />
  </v-btn>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { appStore } from '@/store';

@Component
export default class Loading extends Vue {
  private get isLoading(): boolean {
    return appStore.isLoading;
  }
}
</script>
