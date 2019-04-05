<template>
  <v-toolbar app fixed flat dense>
    <v-menu offset-y>
      <v-btn flat slot="activator">
        <v-icon left>mdi-menu</v-icon>
        {{ $t('system.modules.aniList') }}
      </v-btn>
    </v-menu>

    <v-spacer></v-spacer>

    <template v-if="!isMediaPage">
      <v-toolbar-items>
        <v-btn flat exact :to="{ name: 'Home' }">{{ $t('menu.home') }}</v-btn>

        <template v-if="isAuthenticated">
          <v-btn flat exact :to="{ name: 'Watching' }">{{ $t('menu.watching') }}</v-btn>
        </template>
      </v-toolbar-items>

      <v-spacer></v-spacer>
    </template>

    <v-toolbar-items>
      <v-btn flat v-if="isMediaPage">
        {{ currentMediaTitle }}
      </v-btn>

      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat icon v-if="isSortingPage" v-on="{ ...toolTip }" @click="jumpToTop">
            <v-icon>mdi-arrow-up</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('system.actions.toPageTop') }}</span>
      </v-tooltip>

      <v-menu v-model="sortMenu" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on: sortWindow }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: toolTip }">
              <v-btn flat icon v-if="isSortingPage" v-on="{ ...toolTip, ...sortWindow }">
                <v-icon>mdi-sort</v-icon>
              </v-btn>
            </template>
            <span>{{ $t('system.actions.sort') }}</span>
          </v-tooltip>
        </template>
        <v-card>
          <v-container fluid>
            <v-flex xs12 d-flex>
              <v-select :items="['Name']" label="Sort by"></v-select>
            </v-flex>
          </v-container>
        </v-card>
      </v-menu>


      <v-tooltip bottom>
        <template v-slot:activator="{ on: toolTip }">
          <v-btn flat exact icon :to="{ name: 'Settings' }" v-on="{ ...toolTip }">
            <v-icon>mdi-settings</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('menu.settings') }}</span>
      </v-tooltip>
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
  private sortMenu: boolean = false;

  private get isSortingPage(): boolean {
    return this.$route.meta && this.$route.meta.sortingPage;
  }

  private get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  private get currentMediaTitle(): string | null {
    return aniListStore.currentMediaTitle;
  }

  private get isAuthenticated(): boolean {
    return aniListStore.isAuthenticated;
  }

  private jumpToTop(): void {
    window.scrollTo(0, 0);
  }
}
</script>
