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
  data() {
    return {
      searchContent: [],
    };
  },
  computed: {
    ...mapState(['isReady']),
    ...mapState('myAnimeList', ['timeUntilNextRefresh', 'auth']),
    readableTimeUntilNextRefresh() {
      if (!this.timeUntilNextRefresh) {
        return '';
      }

      return `(${this.$getMoment(this.timeUntilNextRefresh).format('mm:ss')})`;
    },
  },
  methods: {
    mountSearch() {
      $('.ui.search', this.$el)
        .search({
          type: 'category',
          searchFields: ['title', 'synonyms', 'english'],
          source: this.searchContent,
          onSelect: this.onSelectSearchResult,
          onResults: this.onResults,
          searchDelay: 500,
          maxResults: 10,
          fullTextSearch: false,
          cache: false,
        });
    },
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
    onResults() {
      const currentSearchValue = $('.ui.search', this.$el).search('get value');
      this.$http.findAnimes(currentSearchValue, this.auth)
        .then((results) => {
          if (!results) {
            return [];
          }

          if (_.isArray(results)) {
            return _.map(results, (result) => {
              const element = _.find(this.malData, dataInMalData =>
                dataInMalData.series_title === result.title);

              if (element !== undefined) {
                result.category = this.getStatus(element.my_status);
              } else {
                result.category = this.$t('notInList');
              }

              return {
                title: result.title,
                english: result.english,
                synonyms: result.synonyms,
                category: result.category,
              };
            });
          }

          const element = _.find(this.malData, dataInMalData =>
            dataInMalData.series_title === results.title);

          if (element !== undefined) {
            results.category = this.getStatus(element.my_status);
          } else {
            results.category = this.$t('notInList');
          }

          return [{
            title: results.title,
            category: results.category,
            synonyms: results.synonyms,
            english: results.english,
          }];
        })
        .then((results) => {
          this.searchContent = results;
          this.mountSearch();
        })
        .catch(() => {});
    },
  },
  mounted() {
    this.mountSearch();
  },
  updated() {
    this.mountSearch();
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
    "notInList": "Not in your list",
    "searchAnime": "Search...",
    "noResults": "No results could be found"
  },
  "de": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MAL aktualisieren",
    "airing": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste",
    "searchAnime": "Suchen ...",
    "noResults": "Es wurden keine Ergebnisse gefunden"
  },
  "ja": {
    "animeList": "MyAnimeList",
    "refreshMAL": "MALを更新",
    "airing": "見る",
    "completed": "終了",
    "onHold": "中止",
    "canceled": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません",
    "searchAnime": "検索 ...",
    "noResults": "結果は見つかりませんでした。"
  }
}
</i18n>
