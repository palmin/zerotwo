<template>
  <div class="ui top fixed menu">
    <router-link class="item" tag="a" :to="{ name: 'Main' }" active-class="active" exact>
      {{ $t('allAnime') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Airing' }" active-class="active" exact>
      {{ $t('airing') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Finished' }" active-class="active" exact>
      {{ $t('completed') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'OnHold' }" active-class="active" exact>
      {{ $t('onHold') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Canceled' }" active-class="active" exact>
      {{ $t('canceled') }}
    </router-link>
    <router-link class="item" tag="a" :to="{ name: 'Planned' }" active-class="active" exact>
      {{ $t('planned') }}
    </router-link>
    <div class="right menu">
      <div class="ui right aligned search item" id="searchBar">
        <div class="ui transparent icon input">
          <input class="prompt" type="text" :placeholder="$t('searchAnime')">
          <i class="search link icon"></i>
        </div>
        <div class="results"></div>
      </div>
      <a class="ui item" @click="refreshMAL">
        <i class="refresh icon"></i>
        {{ $t('refreshMAL') }}
      </a>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  props: ['openSettings', 'refreshMAL', 'malData', 'openInformation'],
  computed: {
    searchContent() {
      return _.map(this.malData, item => ({
        category: this.getStatus(item.my_status),
        title: item.series_title,
      }));
    },
  },
  watch: {
    searchContent() {
      $('#searchBar', this.$el)
        .search({
          type: 'category',
          source: this.searchContent,
          searchFields: ['title'],
          onSelect: this.onSelectSearchResult,
          fullTextSearch: false,
        });
    },
  },
  methods: {
    getStatus(status) {
      let statusText = '';
      switch (+status) {
        case 1:
          statusText = this.$t('airing');
          break;
        case 2:
          statusText = this.$t('completed');
          break;
        case 3:
          statusText = this.$t('onHold');
          break;
        case 4:
          statusText = this.$t('canceled');
          break;
        case 6:
          statusText = this.$t('planned');
          break;
        default:
          break;
      }

      return statusText;
    },
    onSelectSearchResult(result) {
      this.openInformation(result.title);
    },
  },
  mounted() {
    $('#searchBar', this.$el)
      .search({
        type: 'category',
        source: this.searchContent,
        searchFields: ['title'],
        onSelect: this.onSelectSearchResult,
        fullTextSearch: false,
      });
  },
  updated() {
    $('#searchBar', this.$el)
      .search({
        type: 'category',
        source: this.searchContent,
        searchFields: ['title'],
        onSelect: this.onSelectSearchResult,
        fullTextSearch: false,
      });
  },
};
</script>

<style scoped>
.ui.top.fixed.menu {
  position: sticky;
}
</style>

<i18n>
{
  "en": {
    "animeList": "MyAnimeList",
    "refreshMAL": "Refresh MAL",
    "allAnime": "All Anime",
    "airing": "Airing Anime",
    "completed": "Completed Anime",
    "onHold": "On Hold Anime",
    "canceled": "Canceled Anime",
    "planned": "Planned Anime",
    "searchAnime": "Search Anime..."
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "allAnime": "Alle Anime",
    "airing": "Laufende Anime",
    "completed": "Beendete Anime",
    "onHold": "Pausierte Anime",
    "canceled": "Abgebrochene Anime",
    "planned": "Geplante Anime",
    "searchAnime": "Anime suchen ..."
  }
}
</i18n>
