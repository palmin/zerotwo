<template>
  <v-toolbar app fixed dark flat dense>
    <v-menu offset-y>
      <v-btn flat dark slot="activator">
        <v-icon left>mdi-menu</v-icon>
        {{ $t('system.modules.aniList') }}
      </v-btn>
    </v-menu>

    <v-spacer></v-spacer>

    <template v-if="!isMediaPage">
      <v-toolbar-items>
        <v-btn flat exact :to="{ name: 'Home' }">{{ $t('menu.home') }}</v-btn>
        <v-btn flat exact :to="{ name: 'Watching' }">{{ $t('menu.watching') }}</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>
    </template>

    <v-toolbar-items>
      <v-btn flat dark v-if="isMediaPage">
        {{ currentMediaTitle }}
      </v-btn>
      <v-btn flat dark icon v-if="isSortingPage">
        <v-icon>mdi-sort</v-icon>
      </v-btn>

      <v-btn flat exact icon :to="{ name: 'Settings' }">
        <v-icon>mdi-settings</v-icon>
      </v-btn>
    </v-toolbar-items>

  </v-toolbar>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { Route } from 'vue-router';

// Custom Components
import { aniListStore } from '@/store';

@Component
export default class Navigation extends Vue {
  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  private get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  private get currentMediaTitle(): string | null {
    return aniListStore.currentMediaTitle;
  }
}
</script>
