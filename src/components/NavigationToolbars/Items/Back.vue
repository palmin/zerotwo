<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        v-if="isMediaPage || isSettingsPage || isSearchablePage"
        text
        icon
        v-on="{ ...toolTip }"
        @click="navigateBack"
      >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('actions.back') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch,
} from 'vue-property-decorator';
import { Route } from 'vue-router';

@Component
export default class Back extends Vue {
  private lastRoutes: Route[] = [];

  private get isSearchablePage(): boolean {
    return this.$route.meta && this.$route.meta.searchablePage;
  }

  private get isMediaPage(): boolean {
    return this.$route.meta && this.$route.meta.mediaPage;
  }

  private get isSettingsPage(): boolean {
    return this.$route.name === 'Settings';
  }

  private navigateBack(): void {
    if (this.lastRoutes && this.lastRoutes.length) {
      const lastRoute = this.lastRoutes.pop() as Route;
      this.$router.push(lastRoute);

      // Due to hitting back actually uses "push"
      // Our current route is being saved in our storage.
      // We have to get rid of this entry so we get in no loop.
      this.lastRoutes.pop();
    }
  }

  @Watch('$route', { deep: true })
  private onRouteUpdate(route: Route, oldRoute: Route) {
    this.lastRoutes.push(oldRoute);
  }
}
</script>
