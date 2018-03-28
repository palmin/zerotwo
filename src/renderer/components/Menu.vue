<template>
  <div class="ui top fixed menu">
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
      <div class="ui right aligned search item">
        <div class="ui transparent icon input">
          <input class="prompt" type="text" :placeholder="$t('searchAnime')">
          <i class="search link icon"></i>
        </div>
        <div class="results"></div>
      </div>
      <a class="ui item" :class="{ disabled: !this.auth }" @click="refreshMAL">
        <i class="refresh icon" :class="{ loading: !isReady }"></i>
        {{ $t('refreshMAL') }} {{ readableTimeUntilNextRefresh }}
      </a>
      <a class="ui item" @click="openSettings">
        <i class="settings icon"></i>
      </a>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  props: ['openSettings', 'refreshMAL', 'malData', 'openInformation'],
  computed: {
    ...mapState(['isReady']),
    ...mapState('myAnimeList', ['timeUntilNextRefresh', 'auth']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
    },
    searchContent() {
      return _.map(this.malData, item => ({
        category: this.getStatus(item.my_status),
        title: item.series_title,
      }));
    },
  },
  watch: {
    searchContent() {
      $('.ui.search', this.$el)
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
    $('.ui.search', this.$el)
      .search({
        type: 'category',
        source: this.searchContent,
        searchFields: ['title'],
        onSelect: this.onSelectSearchResult,
        fullTextSearch: false,
      });
  },
  updated() {
    $('.ui.search', this.$el)
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
    "airing": "Airing",
    "completed": "Completed",
    "onHold": "On Hold",
    "canceled": "Canceled",
    "planned": "Planned",
    "searchAnime": "Search..."
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "airing": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "searchAnime": "Suchen ..."
  }
}
</i18n>
