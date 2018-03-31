<template lang="html">
  <div class="ui right aligned item">
    <div class="ui transparent icon input" :class="{ loading: searchTimer }">
      <input type="text" :placeholder="$t('search')" v-model="searchValue" @input="searching = true" @keyup="searching = false" @change="triggerSearch" @blur="hideResultPopup" @focus="triggerResultPopup" />
      <i class="search icon"></i>
    </div>
    <div class="ui special popup">
      <div class="ui middle aligned selection list">
        <div class="item" v-for="result in searchResults" :key="result.title" @click="openSearchResult(result)">
          <div class="category">
            {{ result.category }}
          </div>
          <div class="content">
            <div class="header">{{ result.title }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
  props: ['openInformation'],
  computed: {
    ...mapState('myAnimeList', ['auth', 'malData']),
  },
  data() {
    return {
      searchValue: '',
      searching: false,
      searchTimer: null,
      searchInterval: 500,
      searchResults: [],
      lastSearch: '',

      resultsPresented: false,
    };
  },
  watch: {
    searching(value) {
      if (!value) {
        this.beginSearching();
        return;
      }

      this.abortSearch();
    },
  },
  methods: {
    openSearchResult(result) {
      this.hideResultPopup();
      this.openInformation(result.title);
    },

    triggerSearch() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        this.hideResultPopup();
        return;
      }

      this.search();
    },

    triggerResultPopup() {
      if (this.resultsPresented || _.isEmpty(this.searchResults)) {
        return;
      }

      $(this.$el)
        .popup({
          popup: '.special.popup',
          on: 'manual',
          addTouchEvents: false,
        })
        .popup('show');
      this.resultsPresented = true;
    },

    hideResultPopup() {
      $(this.$el)
        .popup('hide');
      this.resultsPresented = false;
    },

    beginSearching() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        this.hideResultPopup();
        return;
      }

      if (this.searchValue === this.lastSearch && this.resultsPresented) {
        return;
      }

      this.searchTimer = setTimeout(this.search, this.searchInterval);
    },

    abortSearch() {
      clearTimeout(this.searchTimer);
    },

    search() {
      this.searchTimer = null;
      this.lastSearch = this.searchValue;
      this.$http.findAnimes(this.searchValue, this.auth)
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
          if (_.isEmpty(results)) {
            this.hideResultPopup();
            return;
          }

          this.searchResults = _.chain(results)
            .sortBy(['category', 'title'])
            .take(10)
            .value();
          this.triggerResultPopup();
        })
        .catch(() => {});
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
  },
};
</script>

<i18n>
{
  "en": {
    "search": "Search...",
    "airing": "Airing",
    "completed": "Completed",
    "onHold": "On Hold",
    "canceled": "Canceled",
    "planned": "Planned",
    "notInList": "Not in your list"
  },
  "de": {
    "search": "Suchen...",
    "airing": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste"
  },
  "ja": {
    "search": "検索・・・",
    "airing": "見る",
    "completed": "終了",
    "onHold": "中止",
    "canceled": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません"
  }
}
</i18n>
