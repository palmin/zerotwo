<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on: toolTip }">
      <v-btn
        text
        icon
        :to="{ name: 'Search' }"
        v-on="{ ...toolTip }"
      >
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-text-field
        v-show="!isSearchPage"
        v-model="searchInput"
        class="d-none d-md-flex"
        solo
        flat
        :placeholder="$t('actions.fastSearch')"
        @keypress.enter="startSearch"
      />
    </template>
    <span>{{ $t('menus.search') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
  private searchInput: string = '';

  private get isSearchPage(): boolean {
    return this.$route.name === 'Search';
  }

  private startSearch(): void {
    if (!this.searchInput) {
      return;
    }

    const query = this.searchInput;
    this.searchInput = '';

    this.$router.push({
      name: 'Search',
      params: {
        query,
      },
    });
  }
}
</script>
