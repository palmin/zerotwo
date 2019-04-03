<template>
  <v-toolbar app fixed dark flat dense>
    <v-menu offset-y>
      <v-btn flat dark slot="activator">
        <v-icon left>mdi-menu</v-icon>
        {{ $t('system.modules.aniList') }}
      </v-btn>
    </v-menu>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn flat exact :to="{ name: 'Home' }">{{ $t('menu.home') }}</v-btn>
      <v-btn flat exact :to="{ name: 'Watching' }">{{ $t('menu.watching') }}</v-btn>
    </v-toolbar-items>

    <v-spacer></v-spacer>

    <v-toolbar-items>
      <v-btn flat dark v-if="isMediaPage && mediaTitle()">
        {{ mediaTitle() }}
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

@Component
export default class Navigation extends Vue {
  private get isSortingPage(): boolean {
    const currentRouteName = this.$route.name;

    switch (currentRouteName) {
      case 'Watching':
        return true;
      default:
        return false;
    }
  }

  private get isMediaPage(): boolean {
    const currentRouteName = this.$route.name;

    // TODO: Add Media page route
    switch (currentRouteName) {
      case 'Watching':
        return true;
      default:
        return false;
    }
  }

  @Watch('$route', { deep: true, immediate: true })
  private mediaTitle(route: Route): string | null {
    if (!this.isMediaPage || !route || !route.meta.mediaTitle) {
      return null;
    }

    return route.meta.mediaTitle;
  }
}
</script>
