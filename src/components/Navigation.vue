<template>
  <v-app-bar
    app
    fixed
    flat
    dense
  >
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn text v-on="on">
          <v-icon left>
            mdi-menu
          </v-icon>
          {{ currentRouteName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in menuItems" :key="index" @click="navigateTo(item.location)">
          <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer />

    <template v-if="!isMediaPage && isAniListRoute">
      <AniListToolbar />

      <v-spacer />
    </template>

    <template v-if="isSeasonPreviewPage">
      <SeasonPreviewToolbar />

      <v-spacer />
    </template>

    <template v-if="isMediaPage">
      <MediaToolbar />

      <v-spacer />
    </template>

    <v-toolbar-items>
      <LoadingIndicator />

      <BackButton />
      <TopButton />
      <SortButton />
      <SearchButton />

      <AniListRefresh />

      <SettingsButton />
    </v-toolbar-items>
  </v-app-bar>
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { RawLocation, Route } from 'vue-router';

// Custom Components
import Log from '@/log';
import { AniListListStatus } from '@/modules/AniList/types';
import { aniListStore, appStore } from '@/store';

// Navigation Toolbars
import AniListToolbar from './NavigationToolbars/AniListToolbar.vue';
import MediaToolbar from './NavigationToolbars/MediaToolbar.vue';
import SeasonPreviewToolbar from './NavigationToolbars/SeasonPreviewToolbar.vue';

// Navigation Items
import AniListRefresh from './NavigationToolbars/Items/AniList/Refresh.vue';
import BackButton from './NavigationToolbars/Items/Back.vue';
import LoadingIndicator from './NavigationToolbars/Items/Loading.vue';
import SearchButton from './NavigationToolbars/Items/Search.vue';
import SettingsButton from './NavigationToolbars/Items/Settings.vue';
import SortButton from './NavigationToolbars/Items/Sort.vue';
import TopButton from './NavigationToolbars/Items/Top.vue';

@Component({
  components: {
    AniListToolbar,
    MediaToolbar,
    SeasonPreviewToolbar,
    // Indicators
    LoadingIndicator,
    // Buttons
    BackButton,
    SearchButton,
    SettingsButton,
    SortButton,
    TopButton,
    // AniList Buttons
    AniListRefresh,
  },
})
export default class Navigation extends Vue {
  private menuItems: Array<{ title: string, location: RawLocation }> = [{
    title: 'misc.modules.aniList',
    location: { name: 'Home' },
  }, {
    title: 'menus.aniList.seasonPreview',
    location: { name: 'SeasonPreview' },
  }];

  private get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  private get isSeasonPreviewPage(): boolean {
    return this.$route.meta && this.$route.path === '/season-preview';
  }

  private get currentRouteName(): string {
    const { routeName } = this.$route.meta;

    return this.$t(`routes.${routeName}`) as string;
  }

  private get isAniListRoute(): boolean {
    const currentRoute = this.$route.path;

    return currentRoute.startsWith('/aniList');
  }

  private navigateTo(location: RawLocation) {
    this.$router.push(location);
  }
}
</script>
