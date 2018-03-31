<template lang="html">
  <div class="ui right aligned item">
    <div class="ui transparent icon input" :class="{ loading: searchTimer }">
      <input type="text"
            :placeholder="$t('search')"
            v-model="searchValue"
            @input="searching = true"
            @keyup="searching = false"
            @change="triggerSearch"
          />
      <i class="search icon"></i>
    </div>
    <div class="results transition hidden" id="transitionContainer">
      <div class="category" v-for="result in searchResults">
        <div class="name">{{ result.category }}</div>
        <div class="results">
          <a class="result" @click="openSearchResult(result)">
            <div class="content">
              <div class="title">
                {{ result.title }}
              </div>
              <div class="description" v-if="result.english">
                {{ result.english }}
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import _ from 'lodash';
import { mapState } from 'vuex';

export default {
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
      this.$emit('openInformation', result);
      this.toggleResultPopup();
    },

    triggerSearch() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        this.toggleResultPopup('hide');
        return;
      }

      this.search();
    },

    toggleResultPopup(transition = 'show') {
      const element = $('#transitionContainer', this.$el);
      if ((_.isEmpty(this.searchResults) && transition !== 'hide') || element.transition('is animating')) {
        return;
      }

      if (transition === 'hide' || transition === 'show') {
        setTimeout(() => { element.transition(transition); }, 100);
        return;
      }

      element
        .transition(transition);
    },

    beginSearching() {
      if (this.searchValue.length < 3) {
        this.searchResults = [];
        this.toggleResultPopup('hide');
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
            this.toggleResultPopup('hide');
            return;
          }

          this.searchResults = _.chain(results)
            .sortBy(['category', 'title'])
            .take(10)
            .value();
          this.toggleResultPopup();
        })
        .catch(() => {});
    },

    getStatus(status) {
      let statusText = '';
      switch (+status) {
        case 1:
          statusText = this.$t('watching');
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

<style lang="scss" scoped>

#transitionContainer {
  position: absolute;
  top: 100%;
  left: -75%;
  transform-origin: center;
  white-space: normal;
  background: #fff;
  margin-top: .5em;
  width: 40em;
  border-radius: .28571429rem;
  box-shadow: 0 2px 4px 0 rgba(34,36,38,.12), 0 2px 10px 0 rgba(34,36,38,.15);
  border: 1px solid #d4d4d5;
  z-index: 998;

  & > :first-child,
  & > :last-child {
    border-radius: .28571429rem .28571429rem 0 0;
  }

  .category {
    display: table-row;
    box-shadow: none;
    background: #f3f4f5;
    transition: background .1s ease,border-color .1s ease;

    &:last-child {
      border-bottom: none;
    }

    .name {
      display: table-cell;
      text-overflow: ellipsis;
      white-space: nowrap;
      background: 0 0;
      font-size: 1em;
      padding: .4em 1em;
      font-weight: 700;
      color: rgba(0, 0, 0, 0.4);
      border-bottom: 1px solid rgba(34,36,38,.1);
    }

    .results {
      display: table-cell;
      background: #fff;
      border-left: 1px solid rgba(34,36,38,.15);
      border-bottom: 1px solid rgba(34,36,38,.1);
      width: 100%;

      .result {
        cursor: pointer;
        display: block;
        overflow: hidden;
        font-size: 1em;
        padding: .85714286em 1.14285714em;
        color: rgba(0,0,0,.87);
        line-height: 1.33;
        border-bottom: 1px solid rgba(34,36,38,.1);
        -webkit-transition: background .1s ease,border-color .1s ease;
        transition: background .1s ease,border-color .1s ease;

        &:hover {
          background: #f9fafb;
        }

        &:last-child {
          border-bottom: none;
        }

        .title {
          margin: -.14285714em 0 0;
          font-family: Lato,'Helvetica Neue',Arial,Helvetica,sans-serif;
          font-weight: 700;
          font-size: 1em;
          color: rgba(0,0,0,.85);
        }

        .description {
          margin-top: 0;
          font-size: .92857143em;
          color: rgba(0,0,0,.4);
        }
      }
    }
  }
}

</style>

<i18n>
{
  "en": {
    "search": "Search...",
    "watching": "Watching",
    "completed": "Completed",
    "onHold": "On Hold",
    "canceled": "Canceled",
    "planned": "Planned",
    "notInList": "Not in your list"
  },
  "de": {
    "search": "Suchen...",
    "watching": "Laufend",
    "completed": "Beendet",
    "onHold": "Pausiert",
    "canceled": "Abgebrochen",
    "planned": "Geplant",
    "notInList": "Nicht in deiner Liste"
  },
  "ja": {
    "search": "検索・・・",
    "watching": "見る",
    "completed": "終了",
    "onHold": "中止",
    "canceled": "止めました",
    "planned": "見るつもり",
    "notInList": "リストにはありません"
  }
}
</i18n>
