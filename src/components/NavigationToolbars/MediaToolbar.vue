<template>
  <v-toolbar-items>
    <v-btn text>
      {{ currentMediaTitle }}
    </v-btn>
  </v-toolbar-items>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// Custom Components
import { aniListStore } from '@/store';

@Component
export default class MediaToolbar extends Vue {
  private get currentMediaTitle(): string | null {
    return aniListStore.currentMediaTitle;
  }
}
</script>
